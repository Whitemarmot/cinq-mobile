/**
 * Enhanced ContactSlot Component avec animations
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { Contact } from '../types';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export interface ContactSlotProps {
  slot: number;
  contact: Contact | null;
  onPress?: () => void;
  onLongPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  animateIn?: boolean;
  animationDelay?: number;
  showPulse?: boolean; // Pour animer les contacts en ligne
}

const SIZES = {
  small: 48,
  medium: 64,
  large: 80,
};

export function ContactSlot({
  slot,
  contact,
  onPress,
  onLongPress,
  size = 'medium',
  animateIn = false,
  animationDelay = 0,
  showPulse = true,
}: ContactSlotProps) {
  const dimension = SIZES[size];
  const isEmpty = !contact;
  const isOnline = contact?.contact.status === 'online';

  // Animation values
  const scale = useSharedValue(animateIn ? 0 : 1);
  const opacity = useSharedValue(animateIn ? 0 : 1);
  const pulseScale = useSharedValue(1);
  const statusPulse = useSharedValue(1);

  useEffect(() => {
    if (animateIn) {
      // Entry animation
      const delay = animationDelay * 100;
      scale.value = withSpring(1, { 
        damping: 15, 
        stiffness: 200,
        delay 
      });
      opacity.value = withTiming(1, { duration: 300, delay });
    }

    // Pulse animation for online contacts
    if (isOnline && showPulse) {
      statusPulse.value = withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      );
    }
  }, [animateIn, animationDelay, isOnline, showPulse]);

  // Press animation
  const handlePressIn = () => {
    pulseScale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    pulseScale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value * pulseScale.value },
    ],
  }));

  const statusAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: statusPulse.value }],
  }));

  const getStatusColor = () => {
    if (!contact) return colors.gray[300];
    switch (contact.contact.status) {
      case 'online': return colors.online;
      case 'busy': return colors.busy;
      default: return colors.offline;
    }
  };

  const getSlotColor = () => {
    const colorMap = [
      colors.primary,    // Slot 1
      colors.violet,     // Slot 2
      colors.purple,     // Slot 3
      colors.secondary,  // Slot 4
      colors.primary,    // Slot 5
    ];
    return colorMap[slot - 1] || colors.primary;
  };

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        animatedStyle,
      ]}
      activeOpacity={0.9}
    >
      {isEmpty ? (
        <View style={[
          styles.emptySlot, 
          { 
            width: dimension, 
            height: dimension,
            borderColor: getSlotColor(),
          }
        ]}>
          <View style={[styles.slotBadgeEmpty, { backgroundColor: getSlotColor() }]}>
            <Text style={styles.slotBadgeText}>{slot}</Text>
          </View>
          <Text style={[styles.addText, { color: getSlotColor() }]}>+</Text>
        </View>
      ) : (
        <View style={styles.filledSlot}>
          {contact.contact.avatarUrl ? (
            <Image
              source={{ uri: contact.contact.avatarUrl }}
              style={[styles.avatar, { width: dimension, height: dimension }]}
            />
          ) : (
            <View style={[
              styles.avatarPlaceholder, 
              { 
                width: dimension, 
                height: dimension,
                backgroundColor: getSlotColor(),
              }
            ]}>
              <Text style={styles.avatarInitial}>
                {(contact.nickname || contact.contact.displayName || contact.contact.username)[0].toUpperCase()}
              </Text>
            </View>
          )}
          
          {/* Status indicator with animation */}
          <Animated.View 
            style={[
              styles.statusDot, 
              { backgroundColor: getStatusColor() },
              isOnline ? statusAnimatedStyle : {}
            ]} 
          />
          
          {/* Slot number badge */}
          <View style={[styles.slotBadge, { backgroundColor: getSlotColor() }]}>
            <Text style={styles.slotBadgeText}>{slot}</Text>
          </View>
          
          {/* Online glow effect */}
          {isOnline && (
            <View style={[
              styles.onlineGlow,
              { 
                width: dimension + 8, 
                height: dimension + 8,
                borderColor: getStatusColor(),
              }
            ]} />
          )}
        </View>
      )}
      
      {contact && (
        <Text style={styles.name} numberOfLines={1}>
          {contact.nickname || contact.contact.displayName || contact.contact.username}
        </Text>
      )}
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing['2'],
  },
  
  emptySlot: {
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    position: 'relative',
  },
  
  slotBadgeEmpty: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  
  addText: {
    ...typography.h2,
    fontWeight: '300',
  },
  
  filledSlot: {
    position: 'relative',
  },
  
  avatar: {
    borderRadius: borderRadius.full,
    ...shadows.md,
  },
  
  avatarPlaceholder: {
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  
  avatarInitial: {
    ...typography.h3,
    color: colors.white,
    fontWeight: '600',
  },
  
  statusDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: colors.white,
    ...shadows.sm,
  },
  
  slotBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  
  slotBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
    fontSize: 11,
  },
  
  onlineGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    opacity: 0.3,
  },
  
  name: {
    ...typography.caption,
    color: colors.text,
    marginTop: spacing['2'],
    maxWidth: 88,
    textAlign: 'center',
    fontWeight: '500',
  },
});
