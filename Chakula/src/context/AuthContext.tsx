import React, { useEffect, useState, createContext, useContext } from "react";

type UserRole =
  | "Restaurant"
  | "Farmer"
  | "Beneficiary"
  | "Waste Partner"
  | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    organization?: string
  ) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://89.168.71.213:5001";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("chakulaUser");
    const storedToken = localStorage.getItem("chakulaToken");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    if (!email || !password) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const userData: User = {
          id: data.user.id || data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          organization: data.user.organization,
        };

        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("chakulaUser", JSON.stringify(userData));

        // Store the token if provided
        if (data.token) {
          localStorage.setItem("chakulaToken", data.token);
        }

        return true;
      } else {
        console.error("Login failed:", data.message || "Unknown error");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    organization?: string
  ): Promise<boolean> => {
    if (!name || !email || !password || !role) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role, organization }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const userData: User = {
          id: data.user.id || data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          organization: data.user.organization,
        };

        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("chakulaUser", JSON.stringify(userData));

        // Store the token if provided
        if (data.token) {
          localStorage.setItem("chakulaToken", data.token);
        }

        return true;
      } else {
        console.error("Signup failed:", data.message || "Unknown error");
        console.error("Full server response:", data);
        console.error("Status code:", response.status);

        if (data.error) {
          console.error("Server error details:", data.error);
        }

        return false;
      }
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("chakulaUser");
    localStorage.removeItem("chakulaToken");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
