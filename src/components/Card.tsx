/**
 * Card Component - Container avec ombre et bordures arrondies
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, borderRadius, shadows, spacing } from '../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: keyof typeof spacing;
  style?: ViewStyle;
  pressable?: boolean;
  onPress?: () => void;
  animated?: boolean;
}

export function Card({
  children,
  variant = 'default',
  padding = '4',
  style,
  pressable = false,
  onPress,
  animated = true,
}: CardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (animated && pressable) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(0.9, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (animated && pressable) {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 100 });
    }
  };

  const CardComponent = pressable ? Animated.View : View;
  const cardStyle = [
    styles.base,
    styles[variant],
    {
      padding: spacing[padding],
    },
    pressable && animated && animatedStyle,
    style,
  ];

  if (pressable) {
    return (
      <Animated.View
        style={cardStyle}
        // @ts-ignore - React Native Reanimated typing issue
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
        onPress={onPress}
      >
        {children}
      </Animated.View>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.xl,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },

  default: {
    ...shadows.sm,
  },

  elevated: {
    ...shadows.lg,
  },

  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.none,
  },

  filled: {
    backgroundColor: colors.gray[50],
    ...shadows.none,
  },
});