/**
 * Simple Icon Component (using emoji for now)
 * TODO: Replace with proper icon library like react-native-vector-icons
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

const ICONS: Record<string, string> = {
  settings: '⚙️',
  search: '🔍',
  add: '+',
  remove: '✕',
  send: '📤',
  chat: '💬',
  phone: '📞',
  edit: '✏️',
  check: '✓',
  arrow: '→',
  back: '←',
  home: '🏠',
  user: '👤',
  heart: '❤️',
  star: '⭐',
  notification: '🔔',
  image: '🖼️',
  camera: '📷',
  mic: '🎙️',
  video: '📹',
  location: '📍',
  link: '🔗',
  menu: '☰',
  close: '✕',
  info: 'ℹ️',
  warning: '⚠️',
  error: '❌',
  success: '✅',
  plus: '+',
  minus: '−',
  dots: '⋯',
};

export function Icon({ name, size = 24, color = colors.text }: IconProps) {
  const icon = ICONS[name] || '?';
  
  return (
    <Text style={[styles.icon, { fontSize: size, color }]}>
      {icon}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});