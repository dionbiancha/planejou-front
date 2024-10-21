import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebase";

export async function googleSignIn() {
  const provider = new GoogleAuthProvider();
  try {
    const res = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(res);
    const accessToken = credential?.accessToken ?? "";
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
