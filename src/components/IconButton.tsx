/**
 * IconButton Component - Touchable icon with animations
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Icon } from './Icon';
import { colors, spacing, borderRadius, shadows } from '../theme';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface IconButtonProps {
  icon: string;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'primary' | 'ghost' | 'outline';
  disabled?: boolean;
  style?: ViewStyle;
  iconColor?: string;
  iconSize?: number;
}

const BUTTON_SIZES = {
  small: 32,
  medium: 40,
  large: 48,
};

const ICON_SIZES = {
  small: 16,
  medium: 20,
  large: 24,
};

export function IconButton({
  icon,
  onPress,
  size = 'medium',
  variant = 'default',
  disabled = false,
  style,
  iconColor,
  iconSize,
}: IconButtonProps) {
  const buttonSize = BUTTON_SIZES[size];
  const defaultIconSize = iconSize || ICON_SIZES[size];
  
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.9, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(0.7, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 100 });
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          ...shadows.md,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {
          backgroundColor: colors.gray[100],
        };
    }
  };

  const getIconColor = () => {
    if (iconColor) return iconColor;
    
    switch (variant) {
      case 'primary':
        return colors.white;
      default:
        return colors.text;
    }
  };

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.button,
        getVariantStyle(),
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
        },
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
      activeOpacity={0.9}
    >
      <Icon
        name={icon}
        size={defaultIconSize}
        color={disabled ? colors.gray[400] : getIconColor()}
      />
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.4,
    ...shadows.none,
  },
});