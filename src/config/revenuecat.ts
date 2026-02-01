/**
 * Configuration RevenueCat
 * Product ID pour l'achat lifetime "5² Premium"
 */

import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

// API Keys RevenueCat (à configurer dans le dashboard RevenueCat)
const REVENUECAT_API_KEY_IOS = 'appl_XXXXXXXXXXXXXXXX'; // TODO: Remplacer par la vraie clé
const REVENUECAT_API_KEY_ANDROID = 'goog_XXXXXXXXXXXXXXXX'; // TODO: Remplacer par la vraie clé

// Product ID pour l'achat lifetime (non-consumable)
export const PREMIUM_PRODUCT_ID = 'cinq_premium_lifetime';

// Entitlement ID dans RevenueCat
export const PREMIUM_ENTITLEMENT_ID = 'premium';

/**
 * Initialise RevenueCat SDK
 */
export async function initializeRevenueCat(userId?: string): Promise<void> {
  try {
    const apiKey = Platform.OS === 'ios' 
      ? REVENUECAT_API_KEY_IOS 
      : REVENUECAT_API_KEY_ANDROID;
    
    await Purchases.configure({ apiKey });
    
    // Si on a un userId Supabase, on l'associe
    if (userId) {
      await Purchases.logIn(userId);
    }
    
    console.log('RevenueCat initialized successfully');
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
    throw error;
  }
}

/**
 * Associe l'utilisateur Supabase à RevenueCat
 */
export async function loginRevenueCat(userId: string): Promise<void> {
  try {
    await Purchases.logIn(userId);
    console.log('RevenueCat user logged in:', userId);
  } catch (error) {
    console.error('Failed to login RevenueCat:', error);
    throw error;
  }
}

/**
 * Déconnecte l'utilisateur RevenueCat
 */
export async function logoutRevenueCat(): Promise<void> {
  try {
    await Purchases.logOut();
    console.log('RevenueCat user logged out');
  } catch (error) {
    console.error('Failed to logout RevenueCat:', error);
  }
}

export default Purchases;
