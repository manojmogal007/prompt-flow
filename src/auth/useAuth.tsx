import { useContext } from "react";
import { AuthContext } from "./authContext";

export const useAuth: any = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
