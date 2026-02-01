/**
 * Premium Badge Component
 * Badge à afficher sur le profil des utilisateurs premium
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, typography, spacing } from '../theme';

interface PremiumBadgeProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

export function PremiumBadge({ size = 'medium', animated = true }: PremiumBadgeProps) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (animated) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1500 }),
          withTiming(1, { duration: 1500 })
        ),
        -1,
        true
      );
    }
  }, [animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const sizeStyles = {
    small: {
      container: styles.containerSmall,
      text: styles.textSmall,
    },
    medium: {
      container: styles.containerMedium,
      text: styles.textMedium,
    },
    large: {
      container: styles.containerLarge,
      text: styles.textLarge,
    },
  };

  const Component = animated ? Animated.View : View;

  return (
    <Component style={[styles.container, sizeStyles[size].container, animated && animatedStyle]}>
      <Text style={[styles.text, sizeStyles[size].text]}>5²</Text>
    </Component>
  );
}

// Version inline pour affichage à côté du nom
export function PremiumBadgeInline() {
  return (
    <View style={styles.inlineContainer}>
      <Text style={styles.inlineText}>5²</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  containerSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  containerMedium: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  containerLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  text: {
    fontWeight: '800',
    color: colors.white,
  },
  textSmall: {
    fontSize: 10,
  },
  textMedium: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 20,
  },
  
  // Inline badge
  inlineContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: spacing.xs,
  },
  inlineText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
  },
});

export default PremiumBadge;
