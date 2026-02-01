/**
 * API Service - Communication avec Supabase
 */

import { User, Contact, Message, Conversation, Post, ApiError } from '../types';
import { supabase, Tables } from '../config/supabase';

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private handleError(error: any): never {
    const apiError: ApiError = {
      message: error.message || 'Une erreur est survenue',
      code: error.code,
      status: error.status || 500,
    };
    throw apiError;
  }

  private mapProfile(profile: Tables<'profiles'>): User {
    return {
      id: profile.id,
      email: profile.email,
      username: profile.username,
      displayName: profile.display_name || undefined,
      avatarUrl: profile.avatar_url || undefined,
      status: profile.status,
      createdAt: profile.created_at,
    };
  }

  // ============ AUTH ============
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) this.handleError(error);
      if (!data.user || !data.session) {
        this.handleError({ message: 'Échec de connexion' });
      }

      // Récupérer le profil utilisateur
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user!.id)
        .single();

      if (profileError) this.handleError(profileError);

      return {
        user: this.mapProfile(profile!),
        token: data.session!.access_token,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async register(data: { email: string; password: string; username: string }): Promise<{ user: User; token: string }> {
    try {
      // Créer le compte
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) this.handleError(authError);
      if (!authData.user || !authData.session) {
        this.handleError({ message: 'Échec de création du compte' });
      }

      // Créer le profil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user!.id,
          email: data.email,
          username: data.username,
          status: 'offline',
        })
        .select()
        .single();

      if (profileError) this.handleError(profileError);

      return {
        user: this.mapProfile(profile!),
        token: authData.session!.access_token,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) this.handleError(error);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getMe(): Promise<User> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) this.handleError(authError || { message: 'Non connecté' });

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (profileError) this.handleError(profileError);

      return this.mapProfile(profile!);
    } catch (error) {
      this.handleError(error);
    }
  }

  // ============ CONTACTS ============
  async getContacts(): Promise<Contact[]> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) this.handleError(authError || { message: 'Non connecté' });

      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          contact:profiles!contacts_contact_id_fkey (*)
        `)
        .eq('user_id', user!.id)
        .order('slot');

      if (error) this.handleError(error);

      return (data || []).map(contact => ({
        id: contact.id,
        userId: contact.user_id,
        contactId: contact.contact_id,
        slot: contact.slot,
        nickname: contact.nickname || undefined,
        contact: this.mapProfile(contact.contact as Tables<'profiles'>),
        lastMessageAt: undefined, // TODO: calculer à partir des messages
      }));
    } catch (error) {
      this.handleError(error);
    }
  }

  async addContact(slot: number, contactId: string): Promise<Contact> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) this.handleError(authError || { message: 'Non connecté' });

      // Supprimer le contact existant à ce slot s'il y en a un
      await supabase
        .from('contacts')
        .delete()
        .eq('user_id', user!.id)
        .eq('slot', slot);

      // Ajouter le nouveau contact
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          user_id: user!.id,
          contact_id: contactId,
          slot,
        })
        .select(`
          *,
          contact:profiles!contacts_contact_id_fkey (*)
        `)
        .single();

      if (error) this.handleError(error);

      return {
        id: data!.id,
        userId: data!.user_id,
        contactId: data!.contact_id,
        slot: data!.slot,
        nickname: data!.nickname || undefined,
        contact: this.mapProfile(data!.contact as Tables<'profiles'>),
        lastMessageAt: undefined,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async removeContact(slot: number): Promise<void> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) this.handleError(authError || { message: 'Non connecté' });

      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('user_id', user!.id)
        .eq('slot', slot);

      if (error) this.handleError(error);
    } catch (error) {
      this.handleError(error);
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${query}%, email.ilike.%${query}%`)
        .limit(10);

      if (error) this.handleError(error);

      return (data || []).map(profile => this.mapProfile(profile));
    } catch (error) {
      this.handleError(error);
    }
  }

  // ============ MESSAGES ============
  async getConversations(): Promise<Conversation[]> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) this.handleError(authError || { message: 'Non connecté' });

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          last_message:messages!conversations_last_message_id_fkey (*)
        `)
        .contains('participants', [user!.id])
        .order('updated_at', { ascending: false });

      if (error) this.handleError(error);

      const conversations: Conversation[] = [];
      
      for (const conv of data || []) {
        // Récupérer les participants
        const { data: participants, error: participantsError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', conv.participants);

        if (participantsError) continue;

        // Compter les messages non lus
        const { count: unreadCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .neq('sender_id', user!.id)
          .is('read_at', null);

        conversations.push({
          id: conv.id,
          participants: participants.map(p => this.mapProfile(p)),
          lastMessage: conv.last_message ? {
            id: conv.last_message.id,
            conversationId: conv.last_message.conversation_id,
            senderId: conv.last_message.sender_id,
            content: conv.last_message.content,
            type: conv.last_message.type,
            createdAt: conv.last_message.created_at,
            readAt: conv.last_message.read_at || undefined,
          } : undefined,
          unreadCount: unreadCount || 0,
          updatedAt: conv.updated_at,
        });
      }

      return conversations;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getConversation(id: string): Promise<Conversation> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          last_message:messages!conversations_last_message_id_fkey (*)
        `)
        .eq('id', id)
        .single();

      if (error) this.handleError(error);

      // Récupérer les participants
      const { data: participants, error: participantsError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', data!.participants);

      if (participantsError) this.handleError(participantsError);

      return {
        id: data!.id,
        participants: participants.map(p => this.mapProfile(p)),
        lastMessage: data!.last_message ? {
          id: data!.last_message.id,
          conversationId: data!.last_message.conversation_id,
          senderId: data!.last_message.sender_id,
          content: data!.last_message.content,
          type: data!.last_message.type,
          createdAt: data!.last_message.created_at,
          readAt: data!.last_message.read_at || undefined,
        } : undefined,
        unreadCount: 0,
        updatedAt: data!.updated_at,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async getMessages(conversationId: string, cursor?: string): Promise<{ messages: Message[]; nextCursor?: string }> {
    try {
      let query = supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (cursor) {
        query = query.lt('created_at', cursor);
      }

      const { data, error } = await query;
      if (error) this.handleError(error);

      const messages = (data || []).map(msg => ({
        id: msg.id,
        conversationId: msg.conversation_id,
        senderId: msg.sender_id,
        content: msg.content,
        type: msg.type,
        createdAt: msg.created_at,
        readAt: msg.read_at || undefined,
      }));

      return {
        messages: messages.reverse(), // Ordre chronologique
        nextCursor: messages.length === 50 ? messages[0].createdAt : undefined,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async sendMessage(conversationId: string, content: string, type: 'text' | 'image' | 'voice' = 'text'): Promise<Message> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) this.handleError(authError || { message: 'Non connecté' });

      // Créer le message
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user!.id,
          content,
          type,
        })
        .select()
        .single();

      if (error) this.handleError(error);

      // Mettre à jour la conversation
      await supabase
        .from('conversations')
        .update({
          last_message_id: data!.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversationId);

      return {
        id: data!.id,
        conversationId: data!.conversation_id,
        senderId: data!.sender_id,
        content: data!.content,
        type: data!.type,
        createdAt: data!.created_at,
        readAt: data!.read_at || undefined,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async markAsRead(conversationId: string): Promise<void> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) this.handleError(authError || { message: 'Non connecté' });

      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user!.id)
        .is('read_at', null);

      if (error) this.handleError(error);
    } catch (error) {
      this.handleError(error);
    }
  }

  // ============ FEED ============
  async getFeed(cursor?: string): Promise<{ posts: Post[]; nextCursor?: string }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) this.handleError(authError || { message: 'Non connecté' });

      // Récupérer les IDs des contacts
      const { data: contacts } = await supabase
        .from('contacts')
        .select('contact_id')
        .eq('user_id', user!.id);

      const contactIds = (contacts || []).map(c => c.contact_id);
      const authorIds = [user!.id, ...contactIds]; // Posts de l'utilisateur et de ses contacts

      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles!posts_author_id_fkey (*),
          is_liked:post_likes!left (user_id)
        `)
        .in('author_id', authorIds)
        .order('created_at', { ascending: false })
        .limit(20);

      if (cursor) {
        query = query.lt('created_at', cursor);
      }

      const { data, error } = await query;
      if (error) this.handleError(error);

      const posts = (data || []).map(post => ({
        id: post.id,
        authorId: post.author_id,
        author: this.mapProfile(post.author as Tables<'profiles'>),
        content: post.content,
        imageUrl: post.image_url || undefined,
        likesCount: post.likes_count,
        commentsCount: post.comments_count,
        isLiked: Array.isArray(post.is_liked) ? 
          post.is_liked.some((like: any) => like.user_id === user!.id) : 
          false,
        createdAt: post.created_at,
      }));

      return {
        posts,
        nextCursor: posts.length === 20 ? posts[posts.length - 1].createdAt : undefined,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async createPost(content: string, imageUrl?: string): Promise<Post> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) this.handleError(authError || { message: 'Non connecté' });

      const { data, error } = await supabase
        .from('posts')
        .insert({
          author_id: user!.id,
          content,
          image_url: imageUrl,
        })
        .select(`
          *,
          author:profiles!posts_author_id_fkey (*)
        `)
        .single();

      if (error) this.handleError(error);

      return {
        id: data!.id,
        authorId: data!.author_id,
        author: this.mapProfile(data!.author as Tables<'profiles'>),
        content: data!.content,
        imageUrl: data!.image_url || undefined,
        likesCount: data!.likes_count,
        commentsCount: data!.comments_count,
        isLiked: false,
        createdAt: data!.created_at,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async likePost(postId: string): Promise<void> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) this.handleError(authError || { message: 'Non connecté' });

      // Ajouter le like
      const { error: likeError } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user!.id,
        });

      if (likeError && !likeError.message.includes('duplicate')) {
        this.handleError(likeError);
      }

      // Mettre à jour le compteur
      const { error: updateError } = await supabase.rpc('increment_post_likes', {
        post_id: postId
      });

      if (updateError) this.handleError(updateError);
    } catch (error) {
      this.handleError(error);
    }
  }

  async unlikePost(postId: string): Promise<void> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) this.handleError(authError || { message: 'Non connecté' });

      // Supprimer le like
      const { error: unlikeError } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user!.id);

      if (unlikeError) this.handleError(unlikeError);

      // Mettre à jour le compteur
      const { error: updateError } = await supabase.rpc('decrement_post_likes', {
        post_id: postId
      });

      if (updateError) this.handleError(updateError);
    } catch (error) {
      this.handleError(error);
    }
  }
}

export const api = new ApiService();
export default api;
