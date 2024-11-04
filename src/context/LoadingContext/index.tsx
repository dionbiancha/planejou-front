import React, { createContext, useState, ReactNode } from "react";

interface LoadingContextProps {
  show: () => void;
  hide: () => void;
  showScreen: () => void;
  hideScreen: () => void;
  state: boolean;
  stateScreen: boolean;
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
  const [state, setState] = useState<boolean>(false);
  const [stateScreen, setStateScreen] = useState<boolean>(false);

  function show() {
    setState(true);
  }

  function hide() {
    setState(false);
  }

  function showScreen() {
    setStateScreen(true);
  }

  function hideScreen() {
    setStateScreen(false);
  }

  return (
    <LoadingContext.Provider
      value={{
        show,
        hide,
        showScreen,
        hideScreen,
        stateScreen,
        state,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
