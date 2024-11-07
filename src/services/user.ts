import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
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
  updateDoc,
  where,
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
    const darkMode = localStorage.getItem("darkMode") || "Desabilitado";
    const language = localStorage.getItem("language") || "pt-BR";
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
      league: 0,
      totalXp: 0,
      photoURL: res.user.photoURL || "",
      createdAt: currentDate,
      darkMode: darkMode,
      language: language,
      nextResetXp: getNextSundayTimestamp(),
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

export async function getUserRanking(league: number) {
  try {
    const auth = validateAuth();
    const userDocRef = doc(db, "users", auth.userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();

    // Define a query para buscar apenas usuários da mesma liga
    const usersCollection = collection(db, "users");
    const leagueQuery = query(
      usersCollection,
      where("league", "==", league),
      orderBy("xp", "desc")
    );
    const usersSnapshot = await getDocs(leagueQuery);

    // Cria um array de usuários com XP e ID
    const users = usersSnapshot.docs.map((doc, index) => {
      return {
        id: doc.id,
        xp: doc.data().xp || 0, // Define XP padrão como 0 caso não exista
        position: index + 1,
      };
    });

    const myUser = users.find((user) => user.id === auth.userId);

    return {
      ...userData,
      position: myUser?.position,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export async function getTopUsersByXP(league: number) {
  try {
    const auth = validateAuth();
    const usersCollectionRef = collection(db, "users");
    const q = query(
      usersCollectionRef,

      orderBy("xp", "desc"),
      limit(30),
      where("league", "==", league)
    );
    const querySnapshot = await getDocs(q);

    const topUsers = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const firstName = data.name.split(" ")[0];

      return {
        name: firstName,
        xp: data.xp,
        myAccount: data.id === auth.userId,
        photoURL: data.photoURL,
        league: data.league,
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

export async function createAccount(
  email: string,
  password: string,
  name: string
) {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(res.user, {
      displayName: name,
    });

    const currentDate = Timestamp.now();
    const testEndDate = Timestamp.fromMillis(
      currentDate.toMillis() + 7 * 24 * 60 * 60 * 1000
    );
    const darkMode = localStorage.getItem("darkMode") || "Desabilitado";
    const language = localStorage.getItem("language") || "pt-BR";

    const userData = {
      name: res.user.displayName || "",
      id: res.user.uid,
      xp: 0,
      testEndDate,
      hasList: false,
      urlImage: res.user.photoURL || "",
      league: 0,
      totalXp: 0,
      photoURL: res.user.photoURL || "",
      createdAt: currentDate,
      darkMode: darkMode,
      language: language,
      nextResetXp: getNextSundayTimestamp(),
    };

    const userDocRef = doc(db, "users", res.user.uid);

    await setDoc(userDocRef, userData);

    const accessToken = await res.user.getIdToken();
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userId", res.user.uid);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export async function loginWithEmailAndPassword(
  email: string,
  password: string
) {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const accessToken = await res.user.getIdToken();
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userId", res.user.uid);

    return { user: res.user, accessToken };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export async function updateDarkMode(darkMode: string) {
  try {
    const auth = validateAuth();
    const userDocRef = doc(db, "users", auth.userId);
    await updateDoc(userDocRef, { darkMode });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export async function updateLanguage(language: string) {
  try {
    const auth = validateAuth();
    const userDocRef = doc(db, "users", auth.userId);
    await updateDoc(userDocRef, { language });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

function getNextSundayTimestamp(): Timestamp {
  const today = new Date();
  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + (7 - today.getDay()));
  return Timestamp.fromMillis(nextSunday.getTime()); // Converte para Timestamp do Firebase
}

export async function resetUserXpIfNeeded() {
  try {
    const auth = validateAuth();
    const userDocRef = doc(db, "users", auth.userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    const currentTimestamp = Timestamp.now(); // Timestamp atual do Firebase

    if (userData.nextResetXp < currentTimestamp) {
      const nextSundayTimestamp = getNextSundayTimestamp(); // Timestamp do próximo domingo

      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);

      // Cria um array de usuários com XP
      const users = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        xp: doc.data().xp || 0, // Define XP padrão como 0 caso não exista
        league: doc.data().league || 0,
      }));

      // Ordena por XP em ordem decrescente
      users.sort((a, b) => b.xp - a.xp);

      // Encontra a posição do usuário autenticado
      const userPosition =
        users.findIndex((user) => user.id === auth.userId) + 1;
      const leagueUser = users.find((user) => user.id === auth.userId)?.league;

      await updateDoc(userDocRef, {
        nextResetXp: nextSundayTimestamp, // Atualiza com o timestamp do próximo domingo
        xp: 0,
        league: newLeague(userPosition, leagueUser),
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

function newLeague(position: number, league: number) {
  if (position <= 6) {
    return league + 1;
  } else if (position > 6 && position <= 22) {
    return league;
  } else return league === 0 ? 0 : league - 1;
}
