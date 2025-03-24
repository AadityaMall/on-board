"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { getUserByIdAction } from "@/actions/UserActions"; // Import API function
import { useRouter } from "next/navigation";

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
  isAuthenticated: () => Promise<void>; // Function to validate token
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  // Load auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      isAuthenticated(); // Check token validity on reload
    }
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
    router.push("/")
    if (toast) {
      toast.success("Logged out successfully")
    }
  };

  // Check if user is authenticated
  const isAuthenticated = async () => {
    if (!user || !token) return;

    try {
      const response = await getUserByIdAction(user.id);
      if (!response.success) throw new Error("Invalid token");
    } catch (error) {
      console.error("Token expired or invalid. Logging out...");
      logout();
    }
  };

  // Check authentication every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      isAuthenticated();
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  })
   // Cleanup on unmount
  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
