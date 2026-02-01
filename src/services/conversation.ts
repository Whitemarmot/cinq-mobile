/**
 * Service utilitaire pour les conversations
 */

import { api } from './api';
import { supabase } from '../config/supabase';

export class ConversationService {
  /**
   * Créer ou récupérer une conversation entre deux utilisateurs
   */
  static async getOrCreateConversation(userId1: string, userId2: string): Promise<string> {
    try {
      // Chercher une conversation existante
      const participants = [userId1, userId2].sort(); // Ordre consistant
      
      const { data: existingConv, error } = await supabase
        .from('conversations')
        .select('id')
        .contains('participants', participants)
        .eq('participants->1', participants[1]) // Exactement 2 participants
        .single();

      if (!error && existingConv) {
        return existingConv.id;
      }

      // Créer une nouvelle conversation
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert({
          participants: participants,
        })
        .select('id')
        .single();

      if (createError) throw createError;
      
      return newConv!.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Envoyer un message à un contact spécifique
   */
  static async sendMessageToContact(
    contactId: string, 
    content: string, 
    type: 'text' | 'image' | 'voice' = 'text'
  ) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non connecté');

      // Créer ou récupérer la conversation
      const conversationId = await this.getOrCreateConversation(user.id, contactId);
      
      // Envoyer le message
      return await api.sendMessage(conversationId, content, type);
    } catch (error) {
      console.error('Error sending message to contact:', error);
      throw error;
    }
  }

  /**
   * Marquer tous les messages d'une conversation comme lus
   */
  static async markConversationAsRead(conversationId: string) {
    try {
      return await api.markAsRead(conversationId);
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      throw error;
    }
  }
}

export const conversationService = ConversationService;