import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'sonner';
import { config } from '../utils/config';

interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'USER' | 'OPERATOR' | 'ADMIN';
  address?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/health`);
        if (response.ok) {
          setIsDemoMode(false);
          const storedToken = localStorage.getItem('token');
          const storedUser = localStorage.getItem('user');
          if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Backend not available:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    if (isDemoMode) {
      if (email === 'admin@village.com' && password === 'password') {
        const mockUser = {
          id: 1,
          name: 'Admin User',
          email: 'admin@village.com',
          role: 'ADMIN' as const,
          phoneNumber: '+1234567890'
        };
        setUser(mockUser);
        setToken('demo-token');
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', 'demo-token');
        toast.success('Logged in (Demo Mode)');
        return;
      }
      throw new Error('Invalid credentials');
    }

    const response = await authService.login({ email, password });
    setUser(response.user);
    setToken(response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
    toast.success('Logged in successfully');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const register = async (userData: any) => {
    if (isDemoMode) {
      throw new Error('Registration not available in demo mode');
    }
    const response = await authService.register(userData);
    setUser(response.user);
    setToken(response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
  };

  const refreshProfile = async () => {
    if (isDemoMode) return;
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (error) {
      if ((error as any).response?.status === 401) {
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        register,
        isAuthenticated: !!token,
        loading,
        refreshProfile,
        isDemoMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
