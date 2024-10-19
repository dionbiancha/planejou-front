import React, { createContext, useState, ReactNode, useContext } from "react";

type SnackState = {
  title: string;
  type: "success" | "error" | "warning" | "info";
  state?: boolean;
};

interface clientContextProps {
  success: (text: string) => void;
  error: (text: string) => void;
  warning: (text: string) => void;
  info: (text: string) => void;
  hide: () => void;
  snackData: SnackState;
}

export const SnackContext = createContext<clientContextProps | undefined>(
  undefined
);

interface SnackProviderProps {
  children: ReactNode;
}

export const SnackProvider: React.FC<SnackProviderProps> = ({ children }) => {
  const [snackData, setSnack] = useState<SnackState>({
    title: "",
    state: false,
    type: "success",
  });

  function hide() {
    setSnack({
      title: "",
      state: false,
      type: "success",
    });
  }

  function success(text: string) {
    setSnack({
      title: text,
      state: true,
      type: "success",
    });
  }

  function error(text: string) {
    setSnack({
      title: text,
      state: true,
      type: "error",
    });
  }

  function warning(text: string) {
    setSnack({
      title: text,
      state: true,
      type: "warning",
    });
  }

  function info(text: string) {
    setSnack({
      title: text,
      state: true,
      type: "info",
    });
  }

  return (
    <SnackContext.Provider
      value={{
        success,
        error,
        warning,
        info,
        hide,
        snackData,
      }}
    >
      {children}
    </SnackContext.Provider>
  );
};

export const useSnack = () => {
  const context = useContext(SnackContext);

  if (!context) {
    throw new Error("usePreview must be used within a PreviewProvider");
  }

  return context;
};
