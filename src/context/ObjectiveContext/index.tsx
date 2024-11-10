import React, { createContext, useState, ReactNode } from "react";

export interface ObjectiveList {
  goalId: string;
  objectives: Objective[];
}

export interface ObjectiveEdit {
  goalId: string;
  objective: Objective;
}

export interface Objective {
  id?: string;
  name: string;
  repeat: "Diariamente" | "Semanalmente" | "Uma vez";
  perWeek?: number | null;
  selectDaily?: string[] | null;
  remindMe?: string | null;
  goalId?: string;
  completedDays?: string[];
  totalRepeat?: number;
}

interface ObjectiveContextProps {
  editObjective: ObjectiveEdit | null;
  setEditObjective: React.Dispatch<React.SetStateAction<ObjectiveEdit | null>>;
  objectives: ObjectiveList[];
  setObjectives: React.Dispatch<React.SetStateAction<ObjectiveList[]>>;
}

export const ObjectiveContext = createContext<
  ObjectiveContextProps | undefined
>(undefined);

interface ObjectiveProviderProps {
  children: ReactNode;
}

export const ObjectiveProvider: React.FC<ObjectiveProviderProps> = ({
  children,
}) => {
  const [objectives, setObjectives] = useState<ObjectiveList[]>([]);
  const [editObjective, setEditObjective] = useState<ObjectiveEdit | null>(
    null
  );
  return (
    <ObjectiveContext.Provider
      value={{
        editObjective,
        setEditObjective,
        objectives,
        setObjectives,
      }}
    >
      {children}
    </ObjectiveContext.Provider>
  );
};
