/**
 * Settings Screen avec animations
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Animated, { FadeInUp, FadeInDown, SlideInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing } from '../theme';
import { Header, Button } from '../components';
import { FadeInView, StaggeredList } from '../components/AnimatedComponents';
import { useAuth } from '../hooks';

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
}

function SettingItem({ icon, title, subtitle, onPress, danger }: SettingItemProps) {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <Text style={styles.settingIcon}>{icon}</Text>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, danger && styles.dangerText]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        )}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export function SettingsScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Es-tu sûr de vouloir te déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            await logout();
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Bientôt', 'Cette fonctionnalité arrive bientôt !');
  };

  const handleNotifications = () => {
    Alert.alert('Bientôt', 'Cette fonctionnalité arrive bientôt !');
  };

  const handlePrivacy = () => {
    Alert.alert('Bientôt', 'Cette fonctionnalité arrive bientôt !');
  };

  const handleHelp = () => {
    Alert.alert('Bientôt', 'Cette fonctionnalité arrive bientôt !');
  };

  const handleAbout = () => {
    Alert.alert(
      'À propos de Cinq',
      'Cinq v1.0.0\n\nL\'app pour rester connecté avec tes 5 personnes les plus proches.\n\n❤️ Made with love'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={SlideInUp.duration(300)}>
        <Header
          title="Paramètres"
          leftIcon={<Text style={styles.backIcon}>×</Text>}
          onLeftPress={handleBack}
        />
      </Animated.View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.profileSection}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.displayName || user?.username || 'U')[0].toUpperCase()}
            </Text>
          </View>
          <Text style={styles.profileName}>
            {user?.displayName || user?.username}
          </Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </Animated.View>

        {/* Settings Groups */}
        <FadeInView delay={200}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compte</Text>
            <SettingItem
              icon="👤"
              title="Modifier le profil"
              subtitle="Photo, nom, bio"
              onPress={handleEditProfile}
            />
            <SettingItem
              icon="🔔"
              title="Notifications"
              subtitle="Gérer les alertes"
              onPress={handleNotifications}
            />
            <SettingItem
              icon="🔒"
              title="Confidentialité"
              subtitle="Qui peut te voir"
              onPress={handlePrivacy}
            />
          </View>
        </FadeInView>

        <FadeInView delay={300}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Aide</Text>
            <SettingItem
              icon="❓"
              title="Centre d'aide"
              onPress={handleHelp}
            />
            <SettingItem
              icon="ℹ️"
              title="À propos"
              onPress={handleAbout}
            />
          </View>
        </FadeInView>

        <FadeInView delay={400}>
          <View style={styles.section}>
            <SettingItem
              icon="🚪"
              title="Déconnexion"
              onPress={handleLogout}
              danger
            />
          </View>
        </FadeInView>

        <FadeInView delay={500}>
          <Text style={styles.version}>Cinq v1.0.0</Text>
        </FadeInView>
      </ScrollView>
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
  },
  backIcon: {
    fontSize: 28,
    color: colors.text,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  profileName: {
    ...typography.h2,
    color: colors.text,
  },
  profileEmail: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: {
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  settingSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: colors.textMuted,
  },
  dangerText: {
    color: colors.error,
  },
  version: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
