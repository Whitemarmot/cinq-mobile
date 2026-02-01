/**
 * Service Premium - Gestion des achats et statut premium
 */

import Purchases, { 
  PurchasesPackage, 
  CustomerInfo,
  PurchasesError,
  PURCHASES_ERROR_CODE,
} from 'react-native-purchases';
import { supabase } from '../config/supabase';
import { PREMIUM_ENTITLEMENT_ID, PREMIUM_PRODUCT_ID } from '../config/revenuecat';

export interface PremiumStatus {
  isPremium: boolean;
  expirationDate?: string;
}

export interface PremiumProduct {
  identifier: string;
  priceString: string;
  price: number;
  currencyCode: string;
  title: string;
  description: string;
}

class PremiumService {
  /**
   * Vérifie si l'utilisateur a le premium via RevenueCat
   */
  async checkPremiumStatus(): Promise<PremiumStatus> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined;
      
      return {
        isPremium,
        expirationDate: customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.expirationDate || undefined,
      };
    } catch (error) {
      console.error('Failed to check premium status:', error);
      return { isPremium: false };
    }
  }

  /**
   * Récupère le produit premium disponible
   */
  async getPremiumProduct(): Promise<PremiumProduct | null> {
    try {
      const offerings = await Purchases.getOfferings();
      
      // Chercher dans l'offering "default" ou "lifetime"
      const offering = offerings.current || offerings.all['lifetime'];
      
      if (!offering) {
        console.warn('No offerings available');
        return null;
      }

      // Le package "lifetime" contient notre produit
      const lifetimePackage = offering.lifetime || offering.availablePackages[0];
      
      if (!lifetimePackage) {
        console.warn('No lifetime package available');
        return null;
      }

      return {
        identifier: lifetimePackage.product.identifier,
        priceString: lifetimePackage.product.priceString,
        price: lifetimePackage.product.price,
        currencyCode: lifetimePackage.product.currencyCode,
        title: lifetimePackage.product.title,
        description: lifetimePackage.product.description,
      };
    } catch (error) {
      console.error('Failed to get premium product:', error);
      return null;
    }
  }

  /**
   * Effectue l'achat du premium lifetime
   */
  async purchasePremium(): Promise<{ success: boolean; error?: string }> {
    try {
      const offerings = await Purchases.getOfferings();
      const offering = offerings.current || offerings.all['lifetime'];
      
      if (!offering) {
        return { success: false, error: 'Aucune offre disponible' };
      }

      const lifetimePackage = offering.lifetime || offering.availablePackages[0];
      
      if (!lifetimePackage) {
        return { success: false, error: 'Produit non disponible' };
      }

      // Effectuer l'achat
      const { customerInfo } = await Purchases.purchasePackage(lifetimePackage);
      
      // Vérifier si l'achat a réussi
      const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined;
      
      if (isPremium) {
        // Sync avec Supabase
        await this.syncPremiumWithSupabase(true);
        return { success: true };
      }

      return { success: false, error: 'Achat non confirmé' };
    } catch (error) {
      const purchasesError = error as PurchasesError;
      
      // Gestion des cas spéciaux
      if (purchasesError.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        return { success: false, error: 'Achat annulé' };
      }
      
      if (purchasesError.code === PURCHASES_ERROR_CODE.PRODUCT_ALREADY_PURCHASED_ERROR) {
        // L'utilisateur a déjà le produit, on sync avec Supabase
        await this.syncPremiumWithSupabase(true);
        return { success: true };
      }

      console.error('Purchase failed:', purchasesError);
      return { 
        success: false, 
        error: purchasesError.message || 'Erreur lors de l\'achat' 
      };
    }
  }

  /**
   * Restaure les achats (pour les utilisateurs qui ont déjà acheté)
   */
  async restorePurchases(): Promise<{ success: boolean; isPremium: boolean; error?: string }> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined;
      
      if (isPremium) {
        // Sync avec Supabase
        await this.syncPremiumWithSupabase(true);
      }

      return { success: true, isPremium };
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      return { 
        success: false, 
        isPremium: false,
        error: 'Erreur lors de la restauration' 
      };
    }
  }

  /**
   * Synchronise le statut premium avec Supabase
   */
  async syncPremiumWithSupabase(isPremium: boolean): Promise<void> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Not authenticated, cannot sync premium');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: isPremium })
        .eq('id', user.id);

      if (error) {
        console.error('Failed to sync premium with Supabase:', error);
      } else {
        console.log('Premium synced with Supabase:', isPremium);
      }
    } catch (error) {
      console.error('Failed to sync premium:', error);
    }
  }

  /**
   * Récupère le statut premium depuis Supabase (fallback)
   */
  async getPremiumFromSupabase(): Promise<boolean> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return false;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Failed to get premium from Supabase:', error);
        return false;
      }

      return data?.is_premium || false;
    } catch (error) {
      console.error('Failed to get premium status:', error);
      return false;
    }
  }
}

export const premiumService = new PremiumService();
export default premiumService;
