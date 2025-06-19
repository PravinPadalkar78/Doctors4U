import React, { createContext, useEffect, useState } from "react";
import { RoleEnum, type ILoggedInUserDetails, type IUsersList } from "../Helper/types";

interface IAuthContext {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  loggedInUserDetails: ILoggedInUserDetails | null;
  setLoggedInUserDetails: React.Dispatch<React.SetStateAction<ILoggedInUserDetails | null>>;
  usersList: IUsersList[];
  setUsersList: React.Dispatch<React.SetStateAction<IUsersList[]>>;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const stored = localStorage.getItem("isAuthenticated");
    return stored ? JSON.parse(stored) : false;
  });
  const [loggedInUserDetails, setLoggedInUserDetails] = useState<ILoggedInUserDetails | null>(() => {
    const stored = localStorage.getItem("loggedInUserDetails");
    return stored ? JSON.parse(stored) : null;
  });
  const [usersList, setUsersList] = useState<IUsersList[]>(() => {
    const stored = localStorage.getItem("usersList");
    return stored
      ? JSON.parse(stored)
      : [
          {
            userId: "1",
            emailId: "doctor@gmail.com",
            password: `$2a$10$O.ZvjUnZzQK0gJ8IzFO8J.FSosNqT0BGVn8iuVZsGbHrogqYVYDfe`,
            role: RoleEnum.doctor,
          },
          {
            userId: "2",
            emailId: "nurse1@gmail.com",
            password: `$2a$10$O.ZvjUnZzQK0gJ8IzFO8J.FSosNqT0BGVn8iuVZsGbHrogqYVYDfe`,
            role: RoleEnum.nurse,
          },
        ];
  });
  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
    localStorage.setItem("loggedInUserDetails", JSON.stringify(loggedInUserDetails));
    localStorage.setItem("usersList", JSON.stringify(usersList));
  }, [isAuthenticated, loggedInUserDetails, usersList]);
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        loggedInUserDetails,
        setLoggedInUserDetails,
        usersList,
        setUsersList,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
