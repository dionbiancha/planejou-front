import React, { createContext, useState, ReactNode } from "react";

interface LoadingContextProps {
  show: () => void;
  hide: () => void;
  state: boolean;
}

export const LoadingContext = createContext<LoadingContextProps | undefined>(
  undefined
);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<boolean>(true);

  function show() {
    setState(true);
  }

  function hide() {
    setState(false);
  }

  return (
    <LoadingContext.Provider
      value={{
        show,
        hide,
        state,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
