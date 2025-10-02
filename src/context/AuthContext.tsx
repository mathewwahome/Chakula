import React, { useEffect, useState, createContext, useContext } from 'react';
type UserRole = 'Restaurant' | 'Farmer' | 'Beneficiary' | 'Waste Partner' | null;
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
  signup: (name: string, email: string, password: string, role: UserRole, organization?: string) => Promise<boolean>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem('chakulaUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    if (!email || !password) return false;
    const mockUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0],
      email,
      role
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('chakulaUser', JSON.stringify(mockUser));
    return true;
  };
  const signup = async (name: string, email: string, password: string, role: UserRole, organization?: string): Promise<boolean> => {
    if (!name || !email || !password || !role) return false;
    const mockUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      role,
      organization
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('chakulaUser', JSON.stringify(mockUser));
    return true;
  };
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('chakulaUser');
  };
  return <AuthContext.Provider value={{
    user,
    isAuthenticated,
    login,
    signup,
    logout
  }}>
      {children}
    </AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};