/**
 * Card Component - Enhanced card with animations and variants
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { colors, spacing, borderRadius, shadows } from '../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outline' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animated?: boolean;
  animationDelay?: number;
  style?: ViewStyle;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  animated = false,
  animationDelay = 0,
  style,
}: CardProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.white,
          ...shadows.lg,
        };
      case 'outline':
        return {
          backgroundColor: colors.white,
          borderWidth: 1,
          borderColor: colors.border,
          ...shadows.xs,
        };
      case 'filled':
        return {
          backgroundColor: colors.gray[50],
          ...shadows.xs,
        };
      default:
        return {
          backgroundColor: colors.white,
          ...shadows.md,
        };
    }
  };

  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return {};
      case 'sm':
        return { padding: spacing['3'] };
      case 'lg':
        return { padding: spacing['6'] };
      default:
        return { padding: spacing['4'] };
    }
  };

  const CardComponent = animated ? Animated.View : View;
  const animationProps = animated ? {
    entering: FadeIn.delay(animationDelay).duration(400),
  } : {};

  return (
    <CardComponent
      style={[
        styles.card,
        getVariantStyle(),
        getPaddingStyle(),
        style,
      ]}
      {...animationProps}
    >
      {children}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
});