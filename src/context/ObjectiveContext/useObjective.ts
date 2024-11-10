import { useContext } from "react";
import { ObjectiveContext } from "./index";

export const useObjectives = () => {
  const context = useContext(ObjectiveContext);
  if (!context) {
    throw new Error("useObjectives must be used within a ObjectiveProvider");
  }
  return context;
};
