import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { validateAuth } from "./authService";

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
