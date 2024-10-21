import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
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
      // Se o documento já existir, adiciona o campo objectives
      await updateDoc(docRef, {
        // Aqui você pode escolher como deseja adicionar o campo
        objectives: {
          ...docSnap.data()?.objectives, // Mantém os objectives existentes
          ...objectives, // Adiciona os novos objectives
        },
      });
      console.log("Objectives adicionados com sucesso!");
    } else {
      // Caso não exista, cria um novo documento com goalId, userId e objectives
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
