import React, { useState } from "react";
import { useApiQuery } from "../utils/customHooks/apiHooks";
import { useGetAuthRequestQuery } from "../utils/services/authService";

interface AuthContextType {
  user: any;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Record<string, any>>({});

  const handleUser = (user: any) => setUser({ ...user, id: user._id });
  const authConfig = { user, handleUser };
  return (
    <AuthContext.Provider value={authConfig}>{children}</AuthContext.Provider>
  );
};
