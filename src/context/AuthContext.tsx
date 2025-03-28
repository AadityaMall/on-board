"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { getUserByIdAction } from "@/actions/UserActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Define types
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: (toast?: any) => void;
  isAuthenticated: () => Promise<void>;
}

const decodeToken = (token: string) => {
  try {
    const base64Url = token.split(".")[1]; // Get payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload); // Return decoded payload
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  // Load auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
    setInitialized(true); 
  }, []);

  // Login function
  const login = (userData: User, token: string) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  // Logout function
  const logout = (toast?: any) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
    if (toast) {
      toast.success("Logged out successfully");
    }
  };

  // Check token expiration
  useEffect(() => {
    if (!token) return;

    const decoded = decodeToken(token);
    if (decoded?.exp) {
      const expiresInMs = decoded.exp * 1000 - Date.now();
      if (expiresInMs > 0) {
        const timeoutId = setTimeout(() => {
          toast.error("Session Expired, Log in again");
          logout();
        }, expiresInMs);

        return () => clearTimeout(timeoutId);
      } else {
        logout();
      }
    }
  }, [token]);

  // WebSocket connection
  useEffect(() => {
    if (!user) return;

    const ws = new WebSocket("ws://localhost:8080/ws/user-updates");

    ws.onopen = () => console.log("Connected to WebSocket");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.userId) return;

        if (data.userDeleted && user?.id === data.userId) {
          console.log("User deleted. Logging out...");
          logout();
          return;
        }

        if (user.id === data.userId) {
          console.log("Updating user...");
          const updatedUser = { ...user, ...data };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("WebSocket JSON parsing error:", error);
      }
    };
    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => console.log("WebSocket Disconnected");

    return () => ws.close();
  }, [user]);

  // Authentication check
  useEffect(() => {
    if (!initialized || !user || !token) return;
    isAuthenticated();
  }, [initialized, user, token]);

  const isAuthenticated = async () => {
    if (!user || !token) {
      logout();
      return;
    }
    try {
      const response = await getUserByIdAction(user.id);
      if (!response.success) throw new Error("Invalid token");
    } catch (error) {
      toast.error("Token expired or invalid. Logging out...");
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook to use AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
