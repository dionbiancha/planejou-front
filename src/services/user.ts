import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { validateAuth } from "./authService";

// Praia
// Tartaruguinha
// Casco Lento
// Casco Duro
// Turbo Tartaruga

export async function googleSignIn() {
  const provider = new GoogleAuthProvider();
  try {
    const res = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(res);
    const accessToken = credential?.accessToken ?? "";
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userId", res.user.uid);

    const currentDate = Timestamp.now();
    const testEndDate = Timestamp.fromMillis(
      currentDate.toMillis() + 7 * 24 * 60 * 60 * 1000
    );
    const userData = {
      name: res.user.displayName || "",
      id: res.user.uid,
      xp: 0,
      testEndDate,
      hasList: false,
      urlImage: res.user.photoURL || "",
      league: 1,
      totalXp: 0,
    };

    // Referência ao documento do usuário
    const userDocRef = doc(db, "users", res.user.uid);

    // Verifica se o usuário já existe no Firestore
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
      // Se o usuário não existir, adiciona os dados
      await setDoc(userDocRef, userData);
    }

    return { user: res.user, accessToken };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export async function getUserData() {
  try {
    const auth = validateAuth();
    const userDocRef = doc(db, "users", auth.userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data(); // Retorna os dados do usuário
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export async function getUserRanking() {
  try {
    const auth = validateAuth();
    const userDocRef = doc(db, "users", auth.userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);

    // Cria um array de usuários com XP
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      xp: doc.data().xp || 0, // Define XP padrão como 0 caso não exista
    }));

    // Ordena por XP em ordem decrescente
    users.sort((a, b) => b.xp - a.xp);

    // Encontra a posição do usuário autenticado
    const userPosition = users.findIndex((user) => user.id === auth.userId) + 1;

    return {
      ...userData,
      position: userPosition,
      totalUsers: users.length,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
}

export async function getTopUsersByXP() {
  try {
    const auth = validateAuth();
    const usersCollectionRef = collection(db, "users");
    const q = query(usersCollectionRef, orderBy("xp", "desc"), limit(30));
    const querySnapshot = await getDocs(q);

    const topUsers = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const firstName = data.name.split(" ")[0];
      return {
        name: firstName,
        xp: data.xp,
        myAccount: data.id === auth.userId,
      };
    });

    return topUsers;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}