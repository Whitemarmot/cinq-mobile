/**
 * Enhanced Input Component with animations
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  floatingLabel?: boolean;
  helperText?: string;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'default',
  size = 'medium',
  floatingLabel = false,
  helperText,
  style,
  value,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Animation values
  const focusAnimation = useSharedValue(0);
  const labelAnimation = useSharedValue(0);
  const borderAnimation = useSharedValue(0);

  const hasValue = value && value.length > 0;
  const showFloatingLabel = floatingLabel && (isFocused || hasValue);

  useEffect(() => {
    focusAnimation.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
    borderAnimation.value = withSpring(isFocused ? 1 : 0, { damping: 15, stiffness: 200 });
    
    if (floatingLabel) {
      labelAnimation.value = withTiming(showFloatingLabel ? 1 : 0, { duration: 200 });
    }
  }, [isFocused, showFloatingLabel]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        borderAnimation.value,
        [0, 1],
        [error ? colors.error : colors.border, error ? colors.error : colors.primary]
      ),
    };
  });

  const labelAnimatedStyle = useAnimatedStyle(() => {
    if (!floatingLabel) return {};
    
    return {
      transform: [
        {
          translateY: labelAnimation.value * -12,
        },
        {
          scale: 1 - labelAnimation.value * 0.15,
        },
      ],
    };
  });

  const handleFocus = (e: any) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  return (
    <View style={[styles.container, styles[size]]}>
      <View style={styles.inputWrapper}>
        {floatingLabel && label && (
          <Animated.Text
            style={[
              styles.floatingLabel,
              labelAnimatedStyle,
              showFloatingLabel && styles.floatingLabelActive,
              error && styles.floatingLabelError,
            ]}
          >
            {label}
          </Animated.Text>
        )}
        
        {!floatingLabel && label && (
          <Text style={[styles.label, error && styles.labelError]}>{label}</Text>
        )}
        
        <Animated.View
          style={[
            styles.inputContainer,
            styles[variant],
            containerAnimatedStyle,
            isFocused && styles.focused,
            error && styles.error,
          ]}
        >
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              styles[`${size}Input`],
              style,
            ]}
            placeholderTextColor={colors.gray[400]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            {...props}
          />
          
          {rightIcon && (
            <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
              {rightIcon}
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
      
      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing['4'],
  },
  
  // Sizes
  small: {
    marginBottom: spacing['3'],
  },
  medium: {
    marginBottom: spacing['4'],
  },
  large: {
    marginBottom: spacing['5'],
  },
  
  inputWrapper: {
    position: 'relative',
  },
  
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing['1.5'],
  },
  labelError: {
    color: colors.error,
  },
  
  floatingLabel: {
    ...typography.label,
    position: 'absolute',
    left: spacing['4'],
    top: spacing['3'],
    color: colors.gray[500],
    backgroundColor: colors.white,
    paddingHorizontal: spacing['1'],
    zIndex: 1,
  },
  floatingLabelActive: {
    color: colors.primary,
    ...typography.caption,
  },
  floatingLabelError: {
    color: colors.error,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    minHeight: 48,
    paddingHorizontal: spacing['4'],
    transition: 'all 0.2s ease',
  },
  
  // Variants
  default: {
    backgroundColor: colors.gray[50],
  },
  filled: {
    backgroundColor: colors.gray[100],
    borderColor: 'transparent',
  },
  outlined: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  
  focused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  
  error: {
    borderColor: colors.error,
    backgroundColor: colors.white,
  },
  
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing['3'],
    fontSize: 16, // Prevent zoom on iOS
  },
  
  // Input sizes
  smallInput: {
    ...typography.bodySmall,
    paddingVertical: spacing['2'],
  },
  mediumInput: {
    ...typography.body,
    paddingVertical: spacing['3'],
  },
  largeInput: {
    ...typography.bodyLarge,
    paddingVertical: spacing['4'],
  },
  
  leftIcon: {
    marginRight: spacing['3'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  rightIcon: {
    marginLeft: spacing['3'],
    padding: spacing['2'],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  
  helperText: {
    ...typography.caption,
    color: colors.gray[600],
    marginTop: spacing['1.5'],
    marginLeft: spacing['1'],
  },
  
  errorText: {
    color: colors.error,
  },
});
