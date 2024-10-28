import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Goal, Objective } from "../context/GoalContext/GoalContext";
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
  xp: number;
}

interface DeleteObjectiveProps {
  goalId: string;
  objectiveId: string;
}

function calculateRepetitions(
  startDate: Date,
  endDate: Date,
  timesPerWeek: number
): number {
  if (endDate < startDate) {
    return 0;
  }

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const weeks = diffDays / 7;

  const repetitions = Math.floor(weeks * timesPerWeek);

  return repetitions;
}

export async function addObjective({
  goal,
  objectives,
}: {
  goal: Goal;
  objectives: Objective;
}) {
  try {
    const auth = validateAuth();
    const docRef = doc(db, "objectives", goal.id ?? "");
    const docSnap = await getDoc(docRef);

    const startDate = (goal.createdAt as Timestamp).toDate();
    const endDate = (goal.estimatedCompletion as Timestamp).toDate();

    const timesPerWeek =
      objectives.selectDaily?.length || objectives.perWeek || 1;

    const numberOfRepetitions = calculateRepetitions(
      startDate,
      endDate,
      timesPerWeek
    );

    const newObjectiveWithId = {
      ...objectives,
      id: uuidv4(),
      totalRepeat: numberOfRepetitions,
    };

    if (docSnap.exists()) {
      const existingObjectives = docSnap.data()?.objectives || [];

      await updateDoc(docRef, {
        objectives: Array.isArray(existingObjectives)
          ? [...existingObjectives, newObjectiveWithId]
          : [newObjectiveWithId],
      });
    } else {
      await setDoc(docRef, {
        goalId: goal.id,
        userId: auth.userId,
        objectives: [newObjectiveWithId],
      });
    }
  } catch (e) {
    console.error("Error adding objectives: ", e);
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
  xp,
}: MarkObjectiveAsCompletedProps) {
  try {
    const auth = validateAuth();
    const docRef = doc(db, "objectives", goalId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingObjectives = docSnap.data()?.objectives || [];
      const today = new Date()
        .toLocaleDateString("pt-BR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .split("/")
        .reverse()
        .join("-");
      let isCompletedToday = false;
      const updatedObjectives = existingObjectives.map(
        (objective: Objective) => {
          if (objective.id === objectiveId) {
            let updatedCompletedDays = objective.completedDays || [];
            if (updatedCompletedDays.includes(today)) {
              updatedCompletedDays = updatedCompletedDays.filter(
                (day) => day !== today
              );
            } else {
              updatedCompletedDays = [...updatedCompletedDays, today];
              isCompletedToday = true;
            }

            return {
              ...objective,
              completedDays: updatedCompletedDays,
            };
          }
          return objective;
        }
      );
      await updateDoc(docRef, {
        objectives: updatedObjectives,
      });

      const userRef = doc(db, "users", auth.userId);

      if (isCompletedToday) {
        await updateDoc(userRef, {
          xp: increment(xp),
          totalXp: increment(xp),
        });
      } else {
        await updateDoc(userRef, {
          xp: increment(-xp),
          totalXp: increment(-xp),
        });
      }
    } else {
      console.error("Objetivo não encontrado!");
    }
  } catch (e) {
    console.error("Erro ao atualizar o objetivo: ", e);
  }
}

export async function deleteObjective({
  goalId,
  objectiveId,
}: DeleteObjectiveProps) {
  try {
    const docRef = doc(db, "objectives", goalId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingObjectives = docSnap.data()?.objectives || [];
      const updatedObjectives = existingObjectives.filter(
        (objective: Objective) => objective.id !== objectiveId
      );

      await updateDoc(docRef, {
        objectives: updatedObjectives,
      });
    }
  } catch (error) {
    console.error("Error deleting objective: ", error);
  }
}

export async function updateObjective({
  goalId,
  objectiveId,
  updatedData,
}: {
  goalId: string;
  objectiveId: string;
  updatedData: Partial<Objective>;
}) {
  try {
    const docRef = doc(db, "objectives", goalId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingObjectives = docSnap.data()?.objectives || [];
      const updatedObjectives = existingObjectives.map((objective: Objective) =>
        objective.id === objectiveId
          ? {
              ...objective,
              name: updatedData.name,
              repeat: updatedData.repeat,
              perWeek: updatedData.perWeek,
              selectDaily: updatedData.selectDaily,
              remindMe: updatedData.remindMe,
            }
          : objective
      );

      await updateDoc(docRef, {
        objectives: updatedObjectives,
      });
    }
  } catch (error) {
    console.error("Error updating objective: ", error);
  }
}
