/**
 * Types partagés pour l'app Cinq
 */

export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  status: 'online' | 'offline' | 'busy';
  isPremium?: boolean;
  createdAt: string;
}

export interface Contact {
  id: string;
  userId: string;
  contactId: string;
  slot: number; // 1-5
  nickname?: string;
  contact: User;
  lastMessageAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'voice';
  createdAt: string;
  readAt?: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  author: User;
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
