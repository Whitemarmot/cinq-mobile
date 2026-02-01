/**
 * Cinq Design System - Colors
 * Basé sur le design system web existant
 */

export const colors = {
  // Primary palette - Indigo/Violet/Purple
  primary: '#6366F1', // indigo
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  
  // Violet palette
  violet: '#8B5CF6',
  violetLight: '#A78BFA',
  violetDark: '#7C3AED',
  
  // Purple palette
  purple: '#A855F7',
  purpleLight: '#C084FC',
  purpleDark: '#9333EA',
  
  // Secondary (keeping pink for contrast)
  secondary: '#EC4899',
  secondaryLight: '#F472B6',
  secondaryDark: '#DB2777',
  
  // Gradient colors for modern UI
  gradient: {
    primary: ['#6366F1', '#8B5CF6', '#A855F7'],
    secondary: ['#8B5CF6', '#A855F7', '#EC4899'],
    subtle: ['#F8FAFC', '#E2E8F0'],
  },
  
  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Backgrounds
  background: '#FFFFFF',
  backgroundDark: '#111827',
  surface: '#F9FAFB',
  surfaceDark: '#1F2937',
  
  // Text
  text: '#111827',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textMuted: '#9CA3AF',
  textDark: '#FFFFFF',
  
  // Borders
  border: '#E5E7EB',
  borderDark: '#374151',
  
  // Status (contacts)
  online: '#10B981',
  offline: '#9CA3AF',
  busy: '#EF4444',
} as const;

export type ColorKey = keyof typeof colors;
