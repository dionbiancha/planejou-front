import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Objective } from "../context/GoalContext/GoalContext";
import { validateAuth } from "./authService";
import { db } from "../config/firebase";
import { v4 as uuidv4 } from "uuid";

export interface ObjectiveListProps {
  goalId: string;
  objectives: Objective[];
}

export interface MarkObjectiveAsCompletedProps {
  goalId: string;
  objectiveId: string | undefined;
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

    // Gerar um UUID e adicionar ao objetivo
    const newObjectiveWithId = {
      ...objectives,
      id: uuidv4(), // Gera um novo UUID para cada objetivo
    };

    if (docSnap.exists()) {
      const existingObjectives = docSnap.data()?.objectives || [];

      // Verifica se o campo 'objectives' já é um array, e adiciona o novo objetivo
      await updateDoc(docRef, {
        objectives: Array.isArray(existingObjectives)
          ? [...existingObjectives, newObjectiveWithId]
          : [newObjectiveWithId], // Se não for um array, cria um novo array com o novo objetivo
      });
      console.log("Objectives adicionados com sucesso!");
    } else {
      await setDoc(docRef, {
        goalId,
        userId: auth.userId,
        objectives: [newObjectiveWithId], // Cria o array com o novo objetivo
      });
      console.log("Novo objetivo adicionado com sucesso!");
    }
  } catch (e) {
    console.error("Erro ao adicionar objectives: ", e);
  }
}

export async function listObjectivesByUserId(): Promise<ObjectiveListProps[]> {
  try {
    const auth = validateAuth();
    const objectivesCollectionRef = collection(db, "objectives");

    // Cria uma query para buscar apenas os objetivos que correspondem ao userId
    const q = query(
      objectivesCollectionRef,
      where("userId", "==", auth.userId)
    );

    const objectivesSnapshot = await getDocs(q);

    // Retorna apenas os campos goalId e objectives
    const objectivesList: ObjectiveListProps[] = objectivesSnapshot.docs.map(
      (doc) => ({
        goalId: doc.data().goalId,
        objectives: doc.data().objectives,
      })
    );

    return objectivesList;
  } catch (e) {
    console.error("Erro ao listar objetivos por userId: ", e);
    return [];
  }
}

export async function markObjectiveAsCompleted({
  goalId,
  objectiveId,
}: MarkObjectiveAsCompletedProps) {
  try {
    const docRef = doc(db, "objectives", goalId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingObjectives = docSnap.data()?.objectives || [];

      // Obter a data atual no formato YYYY-MM-DD
      const today = new Date().toISOString().split("T")[0];

      // Atualiza o array de objectives, localizando o objetivo pelo id
      const updatedObjectives = existingObjectives.map(
        (objective: Objective) => {
          if (objective.id === objectiveId) {
            let updatedCompletedDays = objective.completedDays || [];

            // Verifica se a data de hoje já está no array
            if (updatedCompletedDays.includes(today)) {
              // Remove a data de hoje
              updatedCompletedDays = updatedCompletedDays.filter(
                (day) => day !== today
              );
            } else {
              // Adiciona a data de hoje
              updatedCompletedDays = [...updatedCompletedDays, today];
            }

            return {
              ...objective,
              completedDays: updatedCompletedDays,
            };
          }
          return objective;
        }
      );

      // Atualiza o documento com o array modificado
      await updateDoc(docRef, {
        objectives: updatedObjectives,
      });
      console.log("Objetivo atualizado com sucesso!");
    } else {
      console.error("Objetivo não encontrado!");
    }
  } catch (e) {
    console.error("Erro ao atualizar o objetivo: ", e);
  }
}
