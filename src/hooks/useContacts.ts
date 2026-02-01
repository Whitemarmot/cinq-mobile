/**
 * Hook de gestion des contacts (5 slots gratuit, 25 slots premium)
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { Contact, User } from '../types';

// Constantes pour les limites
export const FREE_SLOTS = 5;
export const PREMIUM_SLOTS = 25;

interface UseContactsOptions {
  isPremium?: boolean;
}

interface UseContactsReturn {
  contacts: (Contact | null)[]; // Tableau de slots
  filledSlots: number;
  maxSlots: number;
  canAddMore: boolean;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addContact: (slot: number, contactId: string) => Promise<void>;
  removeContact: (slot: number) => Promise<void>;
  searchUsers: (query: string) => Promise<User[]>;
}

export function useContacts(options: UseContactsOptions = {}): UseContactsReturn {
  const { isPremium = false } = options;
  const maxSlots = isPremium ? PREMIUM_SLOTS : FREE_SLOTS;
  
  // Créer un tableau de slots vides
  const emptySlots = useMemo(() => 
    Array(maxSlots).fill(null) as (Contact | null)[], 
    [maxSlots]
  );
  
  const [contacts, setContacts] = useState<(Contact | null)[]>(emptySlots);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calcul du nombre de slots remplis
  const filledSlots = useMemo(() => 
    contacts.filter(c => c !== null).length, 
    [contacts]
  );

  // Peut-on encore ajouter des contacts ?
  const canAddMore = filledSlots < maxSlots;

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getContacts();
      
      // Mapper les contacts dans leurs slots (1-N -> 0-(N-1))
      const slots: (Contact | null)[] = Array(maxSlots).fill(null);
      data.forEach(contact => {
        if (contact.slot >= 1 && contact.slot <= maxSlots) {
          slots[contact.slot - 1] = contact;
        }
      });
      
      setContacts(slots);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement des contacts');
    } finally {
      setIsLoading(false);
    }
  }, [maxSlots]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addContact = useCallback(async (slot: number, contactId: string) => {
    try {
      setError(null);
      const newContact = await api.addContact(slot, contactId);
      setContacts(prev => {
        const updated = [...prev];
        updated[slot - 1] = newContact;
        return updated;
      });
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'ajout du contact');
      throw err;
    }
  }, []);

  const removeContact = useCallback(async (slot: number) => {
    try {
      setError(null);
      await api.removeContact(slot);
      setContacts(prev => {
        const updated = [...prev];
        updated[slot - 1] = null;
        return updated;
      });
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression du contact');
      throw err;
    }
  }, []);

  const searchUsers = useCallback(async (query: string): Promise<User[]> => {
    if (query.length < 2) return [];
    return api.searchUsers(query);
  }, []);

  return {
    contacts,
    filledSlots,
    maxSlots,
    canAddMore,
    isLoading,
    error,
    refresh,
    addContact,
    removeContact,
    searchUsers,
  };
}
