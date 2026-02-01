/**
 * Chat Screen - Conversation avec un contact
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Header, MessageBubble } from '../components';
import { useConversation, useAuth } from '../hooks';
import { Message } from '../types';

interface ChatScreenProps {
  conversationId: string;
  contactName: string;
  onBack: () => void;
}

export function ChatScreen({ conversationId, contactName, onBack }: ChatScreenProps) {
  const { user } = useAuth();
  const {
    messages,
    isLoading,
    isSending,
    hasMore,
    loadMore,
    sendMessage,
    markAsRead,
  } = useConversation(conversationId);
  
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    markAsRead();
  }, [markAsRead]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isSending) return;

    setInputText('');
    try {
      await sendMessage(text);
    } catch (error) {
      // Restaurer le texte en cas d'erreur
      setInputText(text);
    }
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwn = item.senderId === user?.id;
    const nextMessage = messages[index + 1];
    const showTimestamp = !nextMessage || 
      nextMessage.senderId !== item.senderId ||
      new Date(item.createdAt).getTime() - new Date(nextMessage.createdAt).getTime() > 60000;

    return (
      <MessageBubble
        message={item}
        isOwn={isOwn}
        showTimestamp={showTimestamp}
      />
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title={contactName}
          leftIcon={<Text style={styles.backIcon}>←</Text>}
          onLeftPress={onBack}
        />
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title={contactName}
        leftIcon={<Text style={styles.backIcon}>←</Text>}
        onLeftPress={onBack}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          inverted
          contentContainerStyle={styles.messagesList}
          onEndReached={() => hasMore && loadMore()}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Aucun message</Text>
              <Text style={styles.emptySubtext}>Dis bonjour ! 👋</Text>
            </View>
          }
        />

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Message..."
            placeholderTextColor={colors.textLight}
            multiline
            maxLength={1000}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isSending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.sendIcon}>➤</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: colors.text,
  },
  messagesList: {
    paddingVertical: spacing.md,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    transform: [{ scaleY: -1 }], // Because list is inverted
  },
  emptyText: {
    ...typography.h4,
    color: colors.textSecondary,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    marginRight: spacing.sm,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  sendIcon: {
    fontSize: 18,
    color: colors.white,
  },
});
