/**
 * ContactSlot Component - Représente un des 5 slots de contact
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { Contact } from '../types';

export interface ContactSlotProps {
  slot: number;
  contact: Contact | null;
  onPress?: () => void;
  onLongPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

const SIZES = {
  small: 48,
  medium: 64,
  large: 80,
};

export function ContactSlot({
  slot,
  contact,
  onPress,
  onLongPress,
  size = 'medium',
}: ContactSlotProps) {
  const dimension = SIZES[size];
  const isEmpty = !contact;

  const getStatusColor = () => {
    if (!contact) return colors.gray[300];
    switch (contact.contact.status) {
      case 'online': return colors.online;
      case 'busy': return colors.busy;
      default: return colors.offline;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.container,
        { width: dimension, height: dimension },
      ]}
      activeOpacity={0.7}
    >
      {isEmpty ? (
        <View style={[styles.emptySlot, { width: dimension, height: dimension }]}>
          <Text style={styles.slotNumber}>{slot}</Text>
          <Text style={styles.addText}>+</Text>
        </View>
      ) : (
        <View style={styles.filledSlot}>
          {contact.contact.avatarUrl ? (
            <Image
              source={{ uri: contact.contact.avatarUrl }}
              style={[styles.avatar, { width: dimension, height: dimension }]}
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { width: dimension, height: dimension }]}>
              <Text style={styles.avatarInitial}>
                {(contact.nickname || contact.contact.displayName || contact.contact.username)[0].toUpperCase()}
              </Text>
            </View>
          )}
          
          {/* Status indicator */}
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          
          {/* Slot number badge */}
          <View style={styles.slotBadge}>
            <Text style={styles.slotBadgeText}>{slot}</Text>
          </View>
        </View>
      )}
      
      {contact && (
        <Text style={styles.name} numberOfLines={1}>
          {contact.nickname || contact.contact.displayName || contact.contact.username}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  emptySlot: {
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.gray[300],
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
  },
  slotNumber: {
    ...typography.caption,
    color: colors.gray[400],
    position: 'absolute',
    top: 4,
  },
  addText: {
    ...typography.h3,
    color: colors.gray[400],
  },
  filledSlot: {
    position: 'relative',
  },
  avatar: {
    borderRadius: borderRadius.full,
  },
  avatarPlaceholder: {
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    ...typography.h3,
    color: colors.white,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.white,
  },
  slotBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  slotBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  name: {
    ...typography.caption,
    color: colors.text,
    marginTop: spacing.xs,
    maxWidth: 80,
    textAlign: 'center',
  },
});
