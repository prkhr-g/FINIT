'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredToken, removeStoredToken, setStoredToken } from '@/lib/auth';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (token: string, userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = getStoredToken();
      if (token) {
        setUser({ id: '1', name: 'Demo User', email: 'user@fint.com', role: 'user' });
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (token: string, userData: any) => {
    setStoredToken(token);
    setUser(userData);
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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