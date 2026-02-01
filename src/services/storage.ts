/**
 * Storage Service - Persistance locale avec AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  AUTH_TOKEN: '@cinq/auth_token',
  USER: '@cinq/user',
  ONBOARDING_COMPLETE: '@cinq/onboarding_complete',
} as const;

export const storage = {
  // Auth
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.AUTH_TOKEN);
  },

  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
  },

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.AUTH_TOKEN);
  },

  // User
  async getUser<T>(): Promise<T | null> {
    const data = await AsyncStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  async setUser<T>(user: T): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.USER);
  },

  // Onboarding
  async isOnboardingComplete(): Promise<boolean> {
    const value = await AsyncStorage.getItem(KEYS.ONBOARDING_COMPLETE);
    return value === 'true';
  },

  async setOnboardingComplete(): Promise<void> {
    await AsyncStorage.setItem(KEYS.ONBOARDING_COMPLETE, 'true');
  },

  // Clear all
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  },
};

export default storage;
