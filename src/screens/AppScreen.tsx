/**
 * App Screen - L'écran principal avec les 5 contacts
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, typography, spacing } from '../theme';
import { Header, ContactSlot } from '../components';
import { useContacts, useAuth } from '../hooks';

interface AppScreenProps {
  onContactPress: (slot: number) => void;
  onSettingsPress: () => void;
}

export function AppScreen({ onContactPress, onSettingsPress }: AppScreenProps) {
  const { user } = useAuth();
  const { contacts, isLoading } = useContacts();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="cinq"
        rightIcon={<Text style={styles.settingsIcon}>⚙️</Text>}
        onRightPress={onSettingsPress}
      />

      <View style={styles.content}>
        <Text style={styles.greeting}>
          Salut {user?.displayName || user?.username} 👋
        </Text>
        <Text style={styles.subtitle}>
          Tes 5 personnes les plus proches
        </Text>

        {/* Les 5 slots en cercle */}
        <View style={styles.circleContainer}>
          {/* Slot 1 - Top */}
          <View style={[styles.slotPosition, styles.slot1]}>
            <ContactSlot
              slot={1}
              contact={contacts[0]}
              onPress={() => onContactPress(1)}
              size="large"
            />
          </View>

          {/* Slot 2 - Top Right */}
          <View style={[styles.slotPosition, styles.slot2]}>
            <ContactSlot
              slot={2}
              contact={contacts[1]}
              onPress={() => onContactPress(2)}
              size="large"
            />
          </View>

          {/* Slot 3 - Bottom Right */}
          <View style={[styles.slotPosition, styles.slot3]}>
            <ContactSlot
              slot={3}
              contact={contacts[2]}
              onPress={() => onContactPress(3)}
              size="large"
            />
          </View>

          {/* Slot 4 - Bottom Left */}
          <View style={[styles.slotPosition, styles.slot4]}>
            <ContactSlot
              slot={4}
              contact={contacts[3]}
              onPress={() => onContactPress(4)}
              size="large"
            />
          </View>

          {/* Slot 5 - Top Left */}
          <View style={[styles.slotPosition, styles.slot5]}>
            <ContactSlot
              slot={5}
              contact={contacts[4]}
              onPress={() => onContactPress(5)}
              size="large"
            />
          </View>

          {/* Center - User avatar or logo */}
          <View style={styles.center}>
            <View style={styles.centerCircle}>
              <Text style={styles.centerText}>5</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  greeting: {
    ...typography.h2,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  settingsIcon: {
    fontSize: 24,
  },
  circleContainer: {
    width: 300,
    height: 300,
    position: 'relative',
  },
  slotPosition: {
    position: 'absolute',
  },
  slot1: {
    top: 0,
    left: '50%',
    marginLeft: -40,
  },
  slot2: {
    top: 60,
    right: 0,
  },
  slot3: {
    bottom: 30,
    right: 20,
  },
  slot4: {
    bottom: 30,
    left: 20,
  },
  slot5: {
    top: 60,
    left: 0,
  },
  center: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
  },
  centerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    ...typography.h2,
    color: colors.white,
  },
});
