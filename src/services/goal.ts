import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { v4 as uuidv4 } from "uuid";
import { Goal, Objective } from "../context/GoalContext/GoalContext";
import { calculateEstimatedCompletion } from "../utils/time";
import { validateAuth } from "./authService";

export async function addGoalList(goals: Goal[]) {
  try {
    const auth = validateAuth();
    const goalsWithIds = goals.map((goal) => ({
      ...goal,
      id: uuidv4(), // Gera um ID único para cada goal
      estimatedCompletion: calculateEstimatedCompletion(goal.months),
      createdAt: new Date(),
    }));
    await addDoc(collection(db, "goals"), {
      goals: goalsWithIds,
      userId: auth.userId,
    });
  } catch (e) {
    console.error(e);
  }
}

export async function listGoalsByUserId() {
  try {
    const auth = validateAuth();

    const goalsQuery = query(
      collection(db, "goals"),
      where("userId", "==", auth.userId)
    );
    const querySnapshot = await getDocs(goalsQuery);

    if (!querySnapshot.empty) {
      const userGoals = querySnapshot.docs[0].data();
      return userGoals.goals;
    } else {
      console.log("Nenhum documento encontrado para este userId.");
      return null;
    }
  } catch (e) {
    console.error("Erro ao buscar metas:", e);
    return null;
  }
}

export async function addObjective({
  goalId,
  objectives,
}: {
  goalId: string;
  objectives: Objective;
}) {
  try {
    const auth = validateAuth();
    const docRef = doc(db, "objectives", goalId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        objectives: {
          ...docSnap.data()?.objectives,
          ...objectives,
        },
      });
      console.log("Objectives adicionados com sucesso!");
    } else {
      await setDoc(docRef, {
        goalId,
        userId: auth.userId,
        objectives,
      });
      console.log("Novo objetivo adicionado com sucesso!");
    }
  } catch (e) {
    console.error("Erro ao adicionar objectives: ", e);
  }
}
