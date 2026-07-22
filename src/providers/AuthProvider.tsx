'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getStoredToken,
  setStoredToken,
  getStoredRefreshToken,
  setStoredRefreshToken,
  clearStoredAuth,
} from '@/lib/auth';
import { authService, AuthUser } from '@/services/auth.service';
import { userService } from '@/services/user.service';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  // Called after a successful /auth/login (or right after signup, once we
  // have tokens) to persist the session.
  login: (accessToken: string, refreshToken: string, userData: AuthUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On first load, if we have a stored access token, hydrate the session by
  // fetching the current user from the backend (GET /users/me). If the
  // token has expired, fall back to the stored refresh token.
  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me: any = await userService.getProfile();
        setUser({
          id: me.id,
          name: me.fullName || me.name,
          email: me.email,
          role: me.role,
        });
      } catch {
        // Access token likely expired — try a silent refresh.
        const refreshToken = getStoredRefreshToken();
        if (refreshToken) {
          try {
            const tokens = await authService.refresh(refreshToken);
            setStoredToken(tokens.accessToken);
            setStoredRefreshToken(tokens.refreshToken);
            const me: any = await userService.getProfile();
            setUser({
              id: me.id,
              name: me.fullName || me.name,
              email: me.email,
              role: me.role,
            });
          } catch {
            clearStoredAuth();
            setUser(null);
          }
        } else {
          clearStoredAuth();
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback((accessToken: string, refreshToken: string, userData: AuthUser) => {
    setStoredToken(accessToken);
    setStoredRefreshToken(refreshToken);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Even if the network call fails, still clear the local session.
    }
    clearStoredAuth();
    setUser(null);
  }, []);

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