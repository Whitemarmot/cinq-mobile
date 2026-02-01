/**
 * Responsive utilities for different screen sizes
 */

import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone X)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export const screenData = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: SCREEN_WIDTH < 375,
  isMedium: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLarge: SCREEN_WIDTH >= 414,
  isTablet: SCREEN_WIDTH > 768,
  ratio: PixelRatio.get(),
};

/**
 * Scale size based on screen width
 */
export function widthPercentageToDP(widthPercent: number): number {
  return (widthPercent * SCREEN_WIDTH) / 100;
}

/**
 * Scale size based on screen height
 */
export function heightPercentageToDP(heightPercent: number): number {
  return (heightPercent * SCREEN_HEIGHT) / 100;
}

/**
 * Scale font size based on screen
 */
export function scaleFont(size: number): number {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

/**
 * Responsive values based on screen size
 */
export function responsive<T>(
  small: T,
  medium?: T,
  large?: T,
  tablet?: T
): T {
  if (screenData.isTablet && tablet !== undefined) {
    return tablet;
  }
  if (screenData.isLarge && large !== undefined) {
    return large;
  }
  if (screenData.isMedium && medium !== undefined) {
    return medium;
  }
  return small;
}

/**
 * Get spacing value based on screen size
 */
export function getSpacing(baseSpacing: number): number {
  if (screenData.isSmall) {
    return baseSpacing * 0.8;
  }
  if (screenData.isLarge) {
    return baseSpacing * 1.1;
  }
  return baseSpacing;
}

/**
 * Safe area insets approximation
 */
export const safeAreaInsets = {
  top: screenData.height >= 812 ? 44 : 20, // For iPhone X+ vs older
  bottom: screenData.height >= 812 ? 34 : 0,
  left: 0,
  right: 0,
};