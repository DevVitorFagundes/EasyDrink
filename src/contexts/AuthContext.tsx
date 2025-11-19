import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';
import { AuthContextType, User } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Observa mudanças no estado de autenticação do Firebase
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });

    // Cleanup: remove o listener quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await AuthService.login(email, password);
      setUser(userData);
    } catch (error: any) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const userData = await AuthService.register(email, password, name);
      setUser(userData);
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
    } catch (error: any) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await AuthService.resetPassword(email);
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, resetPassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};