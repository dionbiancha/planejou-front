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
