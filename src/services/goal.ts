import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { v4 as uuidv4 } from "uuid";
import { Goal } from "../context/GoalContext/GoalContext";
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
    }
  } catch (e) {
    console.error("Erro ao buscar metas:", e);
    return null;
  }
}
