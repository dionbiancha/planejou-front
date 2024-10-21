import { useContext } from "react";
import { LoadingContext } from ".";

export const useLoading = () => {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("usePreview must be used within a PreviewProvider");
  }

  return context;
};
