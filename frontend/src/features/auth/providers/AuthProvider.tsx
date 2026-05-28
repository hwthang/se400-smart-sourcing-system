import { createContext, useContext, type ReactNode } from "react";
import type { AuthContextType } from "../types/context.type";
import { useProfile } from "../hooks/useProfile";

const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const { user, isLoading } = useProfile();

  const logout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
