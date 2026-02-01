/**
 * Hook d'authentification
 */

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { User, AuthState } from '../types';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; username: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthProvider(): AuthContextValue {
  const [state, setState] = useState<AuthState>(initialState);

  // Initialisation: charger le token stocké
  useEffect(() => {
    const init = async () => {
      try {
        const token = await storage.getToken();
        if (token) {
          api.setToken(token);
          const user = await api.getMe();
          setState({
            user,
            token,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth init error:', error);
        await storage.clearAll();
        api.setToken(null);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    init();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await api.login(email, password);
    await storage.setToken(token);
    await storage.setUser(user);
    api.setToken(token);
    setState({
      user,
      token,
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  const register = useCallback(async (data: { email: string; password: string; username: string }) => {
    const { user, token } = await api.register(data);
    await storage.setToken(token);
    await storage.setUser(user);
    api.setToken(token);
    setState({
      user,
      token,
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch (error) {
      // Ignorer l'erreur, on déconnecte quand même
    }
    await storage.clearAll();
    api.setToken(null);
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const refreshUser = useCallback(async () => {
    if (!state.token) return;
    const user = await api.getMe();
    await storage.setUser(user);
    setState(prev => ({ ...prev, user }));
  }, [state.token]);

  return {
    ...state,
    login,
    register,
    logout,
    refreshUser,
  };
}
