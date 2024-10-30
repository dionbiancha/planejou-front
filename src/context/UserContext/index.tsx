import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import React, { createContext, useState, ReactNode } from "react";

interface UserProps {
  userData: User;
  incompleteObjectivesToday: number;
  xp: number;
  name: string;
  testEndDate: Timestamp;
  hasList: boolean;
  totalXp: number;
  league: number;
  createdAt: Timestamp;
  darkMode: string;
  photoURL: string;
  language: string;
}

interface UserContextProps {
  userData: UserProps;
  setUserData: React.Dispatch<React.SetStateAction<UserProps>>;
  clearUserData: () => void;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const darkMode = localStorage.getItem("darkMode");

  const [userData, setUserData] = useState<UserProps>({
    darkMode: darkMode ?? "Desabilitado",
  } as UserProps);

  function clearUserData() {
    setUserData({} as UserProps);
  }

  return (
    <UserContext.Provider
      value={{
        clearUserData,
        setUserData,
        userData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
