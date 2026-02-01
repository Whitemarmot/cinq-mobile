/**
 * API Service - Communication avec le backend Cinq
 */

import { User, Contact, Message, Conversation, Post, ApiError } from '../types';

// TODO: Configurer l'URL de l'API en fonction de l'environnement
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: 'Une erreur est survenue',
        status: response.status,
      }));
      throw error;
    }

    return response.json();
  }

  // ============ AUTH ============
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: { email: string; password: string; username: string }): Promise<{ user: User; token: string }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getMe(): Promise<User> {
    return this.request('/auth/me');
  }

  // ============ CONTACTS ============
  async getContacts(): Promise<Contact[]> {
    return this.request('/contacts');
  }

  async addContact(slot: number, contactId: string): Promise<Contact> {
    return this.request('/contacts', {
      method: 'POST',
      body: JSON.stringify({ slot, contactId }),
    });
  }

  async removeContact(slot: number): Promise<void> {
    return this.request(`/contacts/${slot}`, { method: 'DELETE' });
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.request(`/users/search?q=${encodeURIComponent(query)}`);
  }

  // ============ MESSAGES ============
  async getConversations(): Promise<Conversation[]> {
    return this.request('/conversations');
  }

  async getConversation(id: string): Promise<Conversation> {
    return this.request(`/conversations/${id}`);
  }

  async getMessages(conversationId: string, cursor?: string): Promise<{ messages: Message[]; nextCursor?: string }> {
    const params = cursor ? `?cursor=${cursor}` : '';
    return this.request(`/conversations/${conversationId}/messages${params}`);
  }

  async sendMessage(conversationId: string, content: string, type: 'text' | 'image' | 'voice' = 'text'): Promise<Message> {
    return this.request(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, type }),
    });
  }

  async markAsRead(conversationId: string): Promise<void> {
    return this.request(`/conversations/${conversationId}/read`, { method: 'POST' });
  }

  // ============ FEED ============
  async getFeed(cursor?: string): Promise<{ posts: Post[]; nextCursor?: string }> {
    const params = cursor ? `?cursor=${cursor}` : '';
    return this.request(`/feed${params}`);
  }

  async createPost(content: string, imageUrl?: string): Promise<Post> {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify({ content, imageUrl }),
    });
  }

  async likePost(postId: string): Promise<void> {
    return this.request(`/posts/${postId}/like`, { method: 'POST' });
  }

  async unlikePost(postId: string): Promise<void> {
    return this.request(`/posts/${postId}/like`, { method: 'DELETE' });
  }
}

export const api = new ApiService();
export default api;
