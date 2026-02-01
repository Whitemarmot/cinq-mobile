/**
 * Enhanced Button Component with new design system
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'violet' | 'purple' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  animated?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  animated = true,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}: ButtonProps) {
  const isDisabled = disabled || loading;
  
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (animated && !isDisabled) {
      scale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(0.8, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (animated) {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 100 });
    }
  };

  const buttonContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={getLoadingColor(variant)}
          size="small"
          style={icon ? { marginRight: spacing['2'] } : undefined}
        />
      );
    }

    const textElement = (
      <Text
        style={[
          styles.text,
          styles[`${variant}Text`],
          styles[`${size}Text`],
          textStyle,
        ]}
      >
        {title}
      </Text>
    );

    if (!icon) {
      return textElement;
    }

    return (
      <Animated.View style={styles.contentContainer}>
        {iconPosition === 'left' && (
          <Animated.View style={[styles.icon, { marginRight: spacing['2'] }]}>
            {icon}
          </Animated.View>
        )}
        {textElement}
        {iconPosition === 'right' && (
          <Animated.View style={[styles.icon, { marginLeft: spacing['2'] }]}>
            {icon}
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[
        animatedStyle,
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.9}
    >
      {buttonContent()}
    </AnimatedTouchableOpacity>
  );
}

// Helper function to get loading indicator color
const getLoadingColor = (variant: string) => {
  switch (variant) {
    case 'outline':
    case 'ghost':
      return colors.primary;
    case 'violet':
      return colors.white;
    case 'purple':
      return colors.white;
    default:
      return colors.white;
  }
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  
  // Content container for icon + text
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Variants
  primary: {
    backgroundColor: colors.primary,
    ...shadows.primary,
  },
  violet: {
    backgroundColor: colors.violet,
    ...shadows.violet,
  },
  purple: {
    backgroundColor: colors.purple,
    ...shadows.purple,
  },
  secondary: {
    backgroundColor: colors.secondary,
    ...shadows.md,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  gradient: {
    backgroundColor: colors.primary, // Fallback
    // Note: For true gradient, we'd need to use LinearGradient from expo-linear-gradient
  },
  
  // Sizes
  small: {
    paddingVertical: spacing['2'],
    paddingHorizontal: spacing['4'],
    minHeight: 36,
  },
  medium: {
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['6'],
    minHeight: 48,
  },
  large: {
    paddingVertical: spacing['4'],
    paddingHorizontal: spacing['8'],
    minHeight: 56,
  },
  
  fullWidth: {
    width: '100%',
  },
  
  disabled: {
    opacity: 0.5,
    ...shadows.none,
  },
  
  // Text styles
  text: {
    textAlign: 'center',
  },
  primaryText: {
    color: colors.white,
  },
  violetText: {
    color: colors.white,
  },
  purpleText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  gradientText: {
    color: colors.white,
  },
  
  // Text sizes
  smallText: {
    ...typography.buttonSmall,
  },
  mediumText: {
    ...typography.button,
  },
  largeText: {
    ...typography.buttonLarge,
  },
});
