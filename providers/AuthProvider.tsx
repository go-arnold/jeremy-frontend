"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api-client';

interface User {
  id: string | number;
  username: string;
  email: string;
  avatar_url?: string;
  cover_image_url?: string;
  handle?: string;
  bio?: string;
  is_online?: boolean;
  first_name?: string;
  last_name?: string;
  is_verified?: boolean;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (credentials: any) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'Identifiants incorrects');
    }

    setUser(data.user);
  };

  const register = async (userData: any) => {
    try {
      await apiFetch('/api/v1/auth/register/', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error: any) {
      // Re-throw with a more user-friendly message if possible
      throw error;
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      refreshUser: fetchMe,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
