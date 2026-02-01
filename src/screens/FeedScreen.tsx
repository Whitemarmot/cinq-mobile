/**
 * Feed Screen - Fil d'actualité
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../theme';
import { Header, Post } from '../components';
import { api } from '../services/api';
import { Post as PostType } from '../types';

export function FeedScreen() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
        setCursor(undefined);
      }
      
      const { posts: data, nextCursor } = await api.getFeed(refresh ? undefined : cursor);
      
      if (refresh) {
        setPosts(data);
      } else {
        setPosts(prev => [...prev, ...data]);
      }
      
      setCursor(nextCursor);
      setHasMore(!!nextCursor);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [cursor]);

  useEffect(() => {
    loadPosts(true);
  }, []);

  const handleRefresh = () => loadPosts(true);
  
  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      loadPosts();
    }
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await api.unlikePost(postId);
      } else {
        await api.likePost(postId);
      }
      
      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? { ...p, isLiked: !isLiked, likesCount: p.likesCount + (isLiked ? -1 : 1) }
            : p
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const renderPost = ({ item }: { item: PostType }) => (
    <Post
      post={item}
      onLike={() => handleLike(item.id, item.isLiked)}
      onComment={() => {/* TODO: Navigate to comments */}}
    />
  );

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>Aucun post pour le moment</Text>
      <Text style={styles.emptySubtext}>
        Ajoute des contacts pour voir leur activité !
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  };

  if (isLoading && posts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Feed" />
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Feed" />
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  list: {
    paddingVertical: spacing.sm,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  emptyText: {
    ...typography.h4,
    color: colors.text,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
});
