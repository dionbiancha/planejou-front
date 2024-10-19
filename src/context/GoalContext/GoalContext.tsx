import React, { createContext, useState, ReactNode } from "react";

export interface Goal {
  id: string;
  content: string;
  months: number;
  objectives?: Objective[];
}

export interface Objective {
  name: string;
  repeat: "Diariamente" | "Semanalmente" | "Uma vez";
  perWeek?: number;
  selectDaily?: string[];
  remindMe?: string;
  goalId: string;
}

interface GoalContextProps {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

export const GoalContext = createContext<GoalContextProps | undefined>(
  undefined
);

interface GoalProviderProps {
  children: ReactNode;
}

export const GoalProvider: React.FC<GoalProviderProps> = ({ children }) => {
  const [goals, setGoals] = useState<Goal[]>([]);

  return (
    <GoalContext.Provider
      value={{
        goals,
        setGoals,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};
