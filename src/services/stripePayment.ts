import { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "../config/firebase";
import { validateAuth } from "./authService";

export const getCheckoutUrl = async (priceId: string): Promise<string> => {
  const authData = validateAuth();
  if (!authData.userId) throw new Error("User is not authenticated");

  const checkoutSessionRef = collection(
    db,
    "customers",
    authData.userId,
    "checkout_sessions"
  );

  const docRef = await addDoc(checkoutSessionRef, {
    price: priceId,
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  });

  return new Promise<string>((resolve, reject) => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      const { error, url } = snap.data() as {
        error?: { message: string };
        url?: string;
      };
      if (error) {
        unsubscribe();
        reject(new Error(`An error occurred: ${error.message}`));
      }
      if (url) {
        console.log("Stripe Checkout URL:", url);
        unsubscribe();
        resolve(url);
      }
    });
  });
};

export const getPortalUrl = async (app: FirebaseApp): Promise<string> => {
  const auth = getAuth(app);
  const user = auth.currentUser;

  let dataWithUrl: any;
  try {
    const functions = getFunctions(app, "us-central1");
    const functionRef = httpsCallable(
      functions,
      "ext-firestore-stripe-payments-createPortalLink"
    );
    const { data } = await functionRef({
      customerId: user?.uid,
      returnUrl: window.location.origin,
    });

    // Add a type to the data
    dataWithUrl = data as { url: string };
    console.log("Reroute to Stripe portal: ", dataWithUrl.url);
  } catch (error) {
    console.error(error);
  }

  return new Promise<string>((resolve, reject) => {
    if (dataWithUrl.url) {
      resolve(dataWithUrl.url);
    } else {
      reject(new Error("No url returned"));
    }
  });
};

export const getPremiumStatus = async () => {
  const auth = validateAuth();
  const userId = auth.userId;
  if (!userId) throw new Error("User not logged in");

  const subscriptionsRef = collection(db, "customers", userId, "subscriptions");
  const q = query(
    subscriptionsRef,
    where("status", "in", ["trialing", "active"])
  );

  return new Promise<{ isPremium: boolean; endDate?: Date }>(
    (resolve, reject) => {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (snapshot.docs.length === 0) {
            resolve({ isPremium: false });
          } else {
            const subscription = snapshot.docs[0].data();
            const endDate = subscription.current_period_end.toDate();
            resolve({ isPremium: true, endDate });
          }
          unsubscribe();
        },
        reject
      );
    }
  );
};
