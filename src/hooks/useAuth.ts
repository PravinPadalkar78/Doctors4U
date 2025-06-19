import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context) {
    return context;
  } else {
    throw new Error("Setup Auth Provider Correctly");
  }
};
