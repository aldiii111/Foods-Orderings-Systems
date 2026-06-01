import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authService } from "@/services/authService";

interface AuthState {
  isAuthenticated: boolean;
  userId: number | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [userId, setUserId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Decode token on mount to get user info
    const decoded = authService.getDecodedToken();
    if (decoded) {
      setUserId(decoded.id);
      setRole(decoded.role);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (_token: string) => {
    // Token sudah disimpan oleh authService.login()
    const decoded = authService.getDecodedToken();
    if (decoded) {
      setUserId(decoded.id);
      setRole(decoded.role);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserId(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
