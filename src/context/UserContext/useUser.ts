import { useContext } from "react";
import { UserContext } from ".";

export const useDataUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("usePreview must be used within a PreviewProvider");
  }

  return context;
};
