/**
 * Hook de gestion des contacts (les 5 slots)
 */

import { useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';
import { Contact, User } from '../types';

interface UseContactsReturn {
  contacts: (Contact | null)[]; // Tableau de 5 slots (0-4)
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addContact: (slot: number, contactId: string) => Promise<void>;
  removeContact: (slot: number) => Promise<void>;
  searchUsers: (query: string) => Promise<User[]>;
}

export function useContacts(): UseContactsReturn {
  const [contacts, setContacts] = useState<(Contact | null)[]>([null, null, null, null, null]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getContacts();
      
      // Mapper les contacts dans leurs slots (1-5 -> 0-4)
      const slots: (Contact | null)[] = [null, null, null, null, null];
      data.forEach(contact => {
        if (contact.slot >= 1 && contact.slot <= 5) {
          slots[contact.slot - 1] = contact;
        }
      });
      
      setContacts(slots);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement des contacts');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    isLoading,
    error,
    refresh,
    addContact,
    removeContact,
    searchUsers,
  };
}
