/**
 * App Screen - L'écran principal avec les 5 contacts (avec animations)
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { Header, ContactSlot } from '../components';
import { ScaleInView, PulseView, AnimatedPressable } from '../components/AnimatedComponents';
import { useContacts, useAuth } from '../hooks';
import type { MainStackParamList } from '../navigation/types';

type AppNavProp = NativeStackNavigationProp<MainStackParamList>;

export function AppScreen() {
  const navigation = useNavigation<AppNavProp>();
  const { user } = useAuth();
  const { contacts, isLoading } = useContacts();

  const handleContactPress = (slot: number) => {
    const contact = contacts[slot - 1];
    const name = contact?.nickname || contact?.contact?.displayName || contact?.contact?.username || `Contact ${slot}`;
    navigation.navigate('Chat', {
      conversationId: contact?.id || `conv-${slot}`,
      contactName: name,
    });
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="cinq"
        rightIcon={<Text style={styles.settingsIcon}>⚙️</Text>}
        onRightPress={handleSettingsPress}
      />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(500)}>
          <Text style={styles.greeting}>
            Salut {user?.displayName || user?.username} 👋
          </Text>
          <Text style={styles.subtitle}>
            Tes 5 personnes les plus proches
          </Text>
        </Animated.View>

        {/* Les 5 slots en cercle avec animations */}
        <View style={styles.circleContainer}>
          {/* Slot 1 - Top */}
          <ScaleInView delay={100} style={[styles.slotPosition, styles.slot1]}>
            <AnimatedPressable onPress={() => handleContactPress(1)}>
              <ContactSlot
                slot={1}
                contact={contacts[0]}
                size="large"
              />
            </AnimatedPressable>
          </ScaleInView>

          {/* Slot 2 - Top Right */}
          <ScaleInView delay={200} style={[styles.slotPosition, styles.slot2]}>
            <AnimatedPressable onPress={() => handleContactPress(2)}>
              <ContactSlot
                slot={2}
                contact={contacts[1]}
                size="large"
              />
            </AnimatedPressable>
          </ScaleInView>

          {/* Slot 3 - Bottom Right */}
          <ScaleInView delay={300} style={[styles.slotPosition, styles.slot3]}>
            <AnimatedPressable onPress={() => handleContactPress(3)}>
              <ContactSlot
                slot={3}
                contact={contacts[2]}
                size="large"
              />
            </AnimatedPressable>
          </ScaleInView>

          {/* Slot 4 - Bottom Left */}
          <ScaleInView delay={400} style={[styles.slotPosition, styles.slot4]}>
            <AnimatedPressable onPress={() => handleContactPress(4)}>
              <ContactSlot
                slot={4}
                contact={contacts[3]}
                size="large"
              />
            </AnimatedPressable>
          </ScaleInView>

          {/* Slot 5 - Top Left */}
          <ScaleInView delay={500} style={[styles.slotPosition, styles.slot5]}>
            <AnimatedPressable onPress={() => handleContactPress(5)}>
              <ContactSlot
                slot={5}
                contact={contacts[4]}
                size="large"
              />
            </AnimatedPressable>
          </ScaleInView>

          {/* Center - User avatar or logo */}
          <Animated.View 
            entering={ZoomIn.delay(600).springify()} 
            style={styles.center}
          >
            <PulseView duration={2000} minScale={0.95} maxScale={1.05}>
              <View style={styles.centerCircle}>
                <Text style={styles.centerText}>5</Text>
              </View>
            </PulseView>
          </Animated.View>
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
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    textAlign: 'center',
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
