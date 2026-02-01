/**
 * Hook d'authentification avec Supabase
 */

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { supabase } from '../config/supabase';
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

  // Initialisation: vérifier la session Supabase
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        if (session?.user) {
          try {
            const user = await api.getMe();
            api.setToken(session.access_token);
            await storage.setToken(session.access_token);
            await storage.setUser(user);
            
            setState({
              user,
              token: session.access_token,
              isLoading: false,
              isAuthenticated: true,
            });
          } catch (error) {
            console.error('Failed to get user profile:', error);
            await storage.clearAll();
            setState(prev => ({ ...prev, isLoading: false }));
          }
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth init error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    init();

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const user = await api.getMe();
            api.setToken(session.access_token);
            await storage.setToken(session.access_token);
            await storage.setUser(user);
            
            setState({
              user,
              token: session.access_token,
              isLoading: false,
              isAuthenticated: true,
            });
          } catch (error) {
            console.error('Failed to get user profile after sign in:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          await storage.clearAll();
          api.setToken(null);
          setState({
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // La logique est gérée par l'API service et les listeners Supabase
    await api.login(email, password);
  }, []);

  const register = useCallback(async (data: { email: string; password: string; username: string }) => {
    // La logique est gérée par l'API service et les listeners Supabase  
    await api.register(data);
  }, []);

  const logout = useCallback(async () => {
    // La logique est gérée par l'API service et les listeners Supabase
    await api.logout();
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const user = await api.getMe();
      await storage.setUser(user);
      setState(prev => ({ ...prev, user }));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    refreshUser,
  };
}
