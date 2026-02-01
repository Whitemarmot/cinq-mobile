/**
 * Hook de gestion du statut Premium
 */

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { premiumService, PremiumProduct, PremiumStatus } from '../services/premium';
import { initializeRevenueCat, loginRevenueCat, logoutRevenueCat } from '../config/revenuecat';
import { useAuth } from './useAuth';

interface PremiumContextValue {
  isPremium: boolean;
  isLoading: boolean;
  product: PremiumProduct | null;
  maxSlots: number;
  
  // Actions
  purchase: () => Promise<{ success: boolean; error?: string }>;
  restore: () => Promise<{ success: boolean; isPremium: boolean; error?: string }>;
  refresh: () => Promise<void>;
}

const PremiumContext = createContext<PremiumContextValue | null>(null);

export function usePremium() {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}

export function usePremiumProvider(): PremiumContextValue {
  const { user, isAuthenticated } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<PremiumProduct | null>(null);

  // Nombre max de slots selon le statut
  const maxSlots = isPremium ? 25 : 5;

  // Initialisation RevenueCat et vérification du statut
  useEffect(() => {
    const init = async () => {
      try {
        // Initialiser RevenueCat
        await initializeRevenueCat(user?.id);

        if (isAuthenticated && user?.id) {
          // Login RevenueCat avec l'ID Supabase
          await loginRevenueCat(user.id);

          // Vérifier le statut premium
          const status = await premiumService.checkPremiumStatus();
          setIsPremium(status.isPremium);

          // Si RevenueCat dit premium, sync avec Supabase
          if (status.isPremium) {
            await premiumService.syncPremiumWithSupabase(true);
          } else {
            // Fallback: vérifier Supabase
            const supabasePremium = await premiumService.getPremiumFromSupabase();
            setIsPremium(supabasePremium);
          }

          // Charger le produit
          const premiumProduct = await premiumService.getPremiumProduct();
          setProduct(premiumProduct);
        }
      } catch (error) {
        console.error('Failed to initialize premium:', error);
        // Fallback: vérifier Supabase
        try {
          const supabasePremium = await premiumService.getPremiumFromSupabase();
          setIsPremium(supabasePremium);
        } catch (e) {
          console.error('Fallback failed:', e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      init();
    } else {
      setIsLoading(false);
      setIsPremium(false);
    }

    return () => {
      // Logout RevenueCat si l'utilisateur se déconnecte
      if (!isAuthenticated) {
        logoutRevenueCat();
      }
    };
  }, [isAuthenticated, user?.id]);

  const purchase = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await premiumService.purchasePremium();
      if (result.success) {
        setIsPremium(true);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const restore = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await premiumService.restorePurchases();
      if (result.isPremium) {
        setIsPremium(true);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const status = await premiumService.checkPremiumStatus();
      setIsPremium(status.isPremium);
    } catch (error) {
      console.error('Failed to refresh premium status:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isPremium,
    isLoading,
    product,
    maxSlots,
    purchase,
    restore,
    refresh,
  };
}

export { PremiumContext };
