/**
 * Animated Components avec React Native Reanimated
 */

import React, { useEffect } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  interpolate,
  Extrapolation,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideInUp,
  ZoomIn,
  BounceIn,
  runOnJS,
} from 'react-native-reanimated';

// Configuration des animations
const springConfig = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

interface AnimatedContainerProps {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * FadeInView - Fade in avec option de délai
 */
export function FadeInView({ children, delay = 0, style }: AnimatedContainerProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(delay, withSpring(0, springConfig));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

/**
 * ScaleInView - Scale bounce in
 */
export function ScaleInView({ children, delay = 0, style }: AnimatedContainerProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    scale.value = withDelay(delay, withSpring(1, { ...springConfig, stiffness: 200 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

/**
 * PulseView - Animation de pulsation continue
 */
interface PulseViewProps extends AnimatedContainerProps {
  duration?: number;
  minScale?: number;
  maxScale?: number;
}

export function PulseView({ 
  children, 
  style, 
  duration = 1500, 
  minScale = 0.95, 
  maxScale = 1.05 
}: PulseViewProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(maxScale, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(minScale, { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

/**
 * SlideInView - Slide from direction
 */
interface SlideInViewProps extends AnimatedContainerProps {
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
}

export function SlideInView({ 
  children, 
  delay = 0, 
  style, 
  direction = 'right', 
  distance = 100 
}: SlideInViewProps) {
  const offset = useSharedValue(direction === 'left' || direction === 'up' ? -distance : distance);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    offset.value = withDelay(delay, withSpring(0, springConfig));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const isHorizontal = direction === 'left' || direction === 'right';
    return {
      opacity: opacity.value,
      transform: isHorizontal 
        ? [{ translateX: offset.value }]
        : [{ translateY: offset.value }],
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

/**
 * ShakeView - Animation de secousse (pour erreurs)
 */
interface ShakeViewProps extends AnimatedContainerProps {
  trigger?: boolean;
  intensity?: number;
}

export function ShakeView({ children, style, trigger = false, intensity = 10 }: ShakeViewProps) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (trigger) {
      translateX.value = withSequence(
        withTiming(-intensity, { duration: 50 }),
        withTiming(intensity, { duration: 50 }),
        withTiming(-intensity, { duration: 50 }),
        withTiming(intensity, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

/**
 * RotateView - Rotation continue
 */
interface RotateViewProps extends AnimatedContainerProps {
  duration?: number;
}

export function RotateView({ children, style, duration = 2000 }: RotateViewProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

/**
 * StaggeredList - Animation décalée pour listes
 */
interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  style?: StyleProp<ViewStyle>;
}

export function StaggeredList({ children, staggerDelay = 100, style }: StaggeredListProps) {
  return (
    <Animated.View style={style}>
      {React.Children.map(children, (child, index) => (
        <FadeInView delay={index * staggerDelay}>
          {child}
        </FadeInView>
      ))}
    </Animated.View>
  );
}

/**
 * Pressable animé avec feedback tactile
 */
interface AnimatedPressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  scaleOnPress?: number;
}

export function AnimatedPressable({ 
  children, 
  onPress, 
  style, 
  scaleOnPress = 0.95 
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(scaleOnPress, { damping: 15, stiffness: 400 });
    opacity.value = withTiming(0.8, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    opacity.value = withTiming(1, { duration: 100 });
    if (onPress) {
      runOnJS(onPress)();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={[style, animatedStyle]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      {children}
    </Animated.View>
  );
}

// Export des presets d'animation pour entering/exiting
export const AnimationPresets = {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideInUp,
  ZoomIn,
  BounceIn,
};
