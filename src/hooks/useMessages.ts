/**
 * Hook de gestion des messages
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { Message, Conversation } from '../types';

interface UseMessagesReturn {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  totalUnread: number;
}

export function useMessages(): UseMessagesReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getConversations();
      setConversations(data);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement des conversations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return {
    conversations,
    isLoading,
    error,
    refresh,
    totalUnread,
  };
}

interface UseConversationReturn {
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  markAsRead: () => Promise<void>;
}

export function useConversation(conversationId: string): UseConversationReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);

  // Charger les messages initiaux
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { messages: data, nextCursor } = await api.getMessages(conversationId);
        setMessages(data);
        setCursor(nextCursor);
        setHasMore(!!nextCursor);
      } catch (err: any) {
        setError(err.message || 'Erreur de chargement des messages');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [conversationId]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    
    try {
      const { messages: data, nextCursor } = await api.getMessages(conversationId, cursor);
      setMessages(prev => [...prev, ...data]);
      setCursor(nextCursor);
      setHasMore(!!nextCursor);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    }
  }, [conversationId, cursor, hasMore, isLoading]);

  const sendMessage = useCallback(async (content: string) => {
    try {
      setIsSending(true);
      setError(null);
      const newMessage = await api.sendMessage(conversationId, content);
      setMessages(prev => [newMessage, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Erreur d\'envoi');
      throw err;
    } finally {
      setIsSending(false);
    }
  }, [conversationId]);

  const markAsRead = useCallback(async () => {
    try {
      await api.markAsRead(conversationId);
    } catch (err) {
      // Silently fail
    }
  }, [conversationId]);

  return {
    messages,
    isLoading,
    isSending,
    error,
    hasMore,
    loadMore,
    sendMessage,
    markAsRead,
  };
}
