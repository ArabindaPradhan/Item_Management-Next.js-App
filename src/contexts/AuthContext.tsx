"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Helper to decode JWT
function parseJwt(token: string): { role?: string; permissions?: string[] } {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    const { role, permissions } = JSON.parse(jsonPayload);
    return { role, permissions };
  } catch (err) {
    console.error("Failed to parse JWT:", err);
    return {};
  }
}

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  isAuthResolved: boolean;
  role: string | null;
  permissions: string[];
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  isAuthResolved: false,
  role: null,
  permissions: [],
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const { role, permissions } = parseJwt(storedToken);
      if (role) setRole(role);
      if (permissions) setPermissions(permissions);
    }
    setIsAuthResolved(true);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const { role, permissions } = parseJwt(newToken);
    setRole(role || null);
    setPermissions(permissions || []);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setRole(null);
    setPermissions([]);
    router.push("/login");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        isAuthResolved,
        role,
        permissions,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
