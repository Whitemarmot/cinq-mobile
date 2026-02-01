/**
 * Chat Screen avec animations
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeInUp, FadeInRight, SlideInRight } from 'react-native-reanimated';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors, typography, spacing } from '../theme';
import { Header, MessageBubble } from '../components';
import { FadeInView } from '../components/AnimatedComponents';
import { useConversation } from '../hooks/useMessages';
import type { MainStackParamList } from '../navigation/types';
import type { Message } from '../types';
import { useAuth } from '../hooks';

type ChatRouteProp = RouteProp<MainStackParamList, 'Chat'>;

export function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute<ChatRouteProp>();
  const { conversationId, contactName } = route.params;
  const { user } = useAuth();
  
  const { messages, sendMessage, isLoading } = useConversation(conversationId);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const text = inputText.trim();
    setInputText('');
    await sendMessage(text);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    // Scroll to bottom on new messages
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwn = item.senderId === user?.id;
    return (
      <FadeInView delay={Math.min(index * 50, 300)} style={styles.messageWrapper}>
        <MessageBubble
          message={item}
          isOwn={isOwn}
        />
      </FadeInView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={SlideInRight.duration(300)}>
        <Header
          title={contactName}
          leftIcon={<Text style={styles.backIcon}>←</Text>}
          onLeftPress={handleBack}
        />
      </Animated.View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Animated.View 
              entering={FadeInUp.delay(300)}
              style={styles.emptyContainer}
            >
              <Text style={styles.emptyText}>
                Aucun message pour l'instant
              </Text>
              <Text style={styles.emptySubtext}>
                Envoie le premier message à {contactName} 💬
              </Text>
            </Animated.View>
          }
        />

        <Animated.View 
          entering={FadeInUp.delay(200)}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Écris un message..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendIcon}>📤</Text>
          </TouchableOpacity>
        </Animated.View>
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
  messagesList: {
    flexGrow: 1,
    padding: spacing.md,
  },
  messageWrapper: {
    marginBottom: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    ...typography.body,
    color: colors.text,
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
    backgroundColor: colors.textMuted,
    opacity: 0.5,
  },
  sendIcon: {
    fontSize: 20,
  },
  backIcon: {
    fontSize: 24,
    color: colors.text,
  },
});
