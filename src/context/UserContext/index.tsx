import { User } from "firebase/auth";
import React, { createContext, useState, ReactNode } from "react";

interface UserContextProps {
  userData: User;
  incompleteObjectivesToday: number;
  setIncompleteObjectivesToday: React.Dispatch<React.SetStateAction<number>>;
  setUserData: React.Dispatch<React.SetStateAction<User>>;
  clearUserData: () => void;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<User>({} as User);
  const [incompleteObjectivesToday, setIncompleteObjectivesToday] = useState(0);

  function clearUserData() {
    setUserData({} as User);
  }

  return (
    <UserContext.Provider
      value={{
        setIncompleteObjectivesToday,
        incompleteObjectivesToday,
        clearUserData,
        setUserData,
        userData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
