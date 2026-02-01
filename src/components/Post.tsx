/**
 * Post Component - Carte de post pour le feed
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { Post as PostType } from '../types';

interface PostProps {
  post: PostType;
  onLike: () => void;
  onComment: () => void;
  onAuthorPress?: () => void;
}

export function Post({ post, onLike, onComment, onAuthorPress }: PostProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'À l\'instant';
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `Il y a ${days}j`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.header} onPress={onAuthorPress}>
        {post.author.avatarUrl ? (
          <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {(post.author.displayName || post.author.username)[0].toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.headerText}>
          <Text style={styles.authorName}>
            {post.author.displayName || post.author.username}
          </Text>
          <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
        </View>
      </TouchableOpacity>

      {/* Content */}
      <Text style={styles.content}>{post.content}</Text>
      
      {/* Image */}
      {post.imageUrl && (
        <Image source={{ uri: post.imageUrl }} style={styles.image} resizeMode="cover" />
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <Text style={[styles.actionIcon, post.isLiked && styles.liked]}>
            {post.isLiked ? '❤️' : '🤍'}
          </Text>
          <Text style={[styles.actionText, post.isLiked && styles.liked]}>
            {post.likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onComment}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{post.commentsCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    padding: spacing.md,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
  headerText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  authorName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textLight,
  },
  content: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: spacing.xs,
  },
  actionText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  liked: {
    color: colors.secondary,
  },
});
