/**
 * MessageBubble Component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showTimestamp?: boolean;
}

export function MessageBubble({ message, isOwn, showTimestamp = true }: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[styles.container, isOwn ? styles.ownContainer : styles.otherContainer]}>
      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        <Text style={[styles.text, isOwn ? styles.ownText : styles.otherText]}>
          {message.content}
        </Text>
      </View>
      
      {showTimestamp && (
        <Text style={[styles.timestamp, isOwn ? styles.ownTimestamp : styles.otherTimestamp]}>
          {formatTime(message.createdAt)}
          {isOwn && message.readAt && ' ✓✓'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    maxWidth: '80%',
  },
  ownContainer: {
    alignSelf: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
  },
  ownBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: borderRadius.sm,
  },
  otherBubble: {
    backgroundColor: colors.gray[100],
    borderBottomLeftRadius: borderRadius.sm,
  },
  text: {
    ...typography.body,
  },
  ownText: {
    color: colors.white,
  },
  otherText: {
    color: colors.text,
  },
  timestamp: {
    ...typography.caption,
    marginTop: 2,
  },
  ownTimestamp: {
    color: colors.textLight,
    textAlign: 'right',
  },
  otherTimestamp: {
    color: colors.textLight,
    textAlign: 'left',
  },
});
