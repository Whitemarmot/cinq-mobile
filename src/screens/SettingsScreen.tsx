/**
 * Settings Screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Header } from '../components';
import { useAuth } from '../hooks';

interface SettingsScreenProps {
  onBack: () => void;
}

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
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Es-tu sûr de vouloir te déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Paramètres"
        leftIcon={<Text style={styles.backIcon}>←</Text>}
        onLeftPress={onBack}
      />

      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.displayName || user?.username || 'U')[0].toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user?.displayName || user?.username}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte</Text>
          
          <SettingItem
            icon="👤"
            title="Modifier le profil"
            subtitle="Nom, photo, bio"
            onPress={() => {/* TODO */}}
          />
          
          <SettingItem
            icon="🔒"
            title="Confidentialité"
            onPress={() => {/* TODO */}}
          />
          
          <SettingItem
            icon="🔔"
            title="Notifications"
            onPress={() => {/* TODO */}}
          />
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences</Text>
          
          <SettingItem
            icon="🎨"
            title="Apparence"
            subtitle="Thème clair/sombre"
            onPress={() => {/* TODO */}}
          />
          
          <SettingItem
            icon="🌍"
            title="Langue"
            subtitle="Français"
            onPress={() => {/* TODO */}}
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <SettingItem
            icon="❓"
            title="Aide"
            onPress={() => {/* TODO */}}
          />
          
          <SettingItem
            icon="📝"
            title="Feedback"
            onPress={() => {/* TODO */}}
          />
          
          <SettingItem
            icon="📄"
            title="Conditions d'utilisation"
            onPress={() => {/* TODO */}}
          />
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <SettingItem
            icon="🚪"
            title="Déconnexion"
            onPress={handleLogout}
            danger
          />
        </View>

        {/* Version */}
        <Text style={styles.version}>cinq v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backIcon: {
    fontSize: 24,
    color: colors.text,
  },
  content: {
    flex: 1,
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
    ...typography.h1,
    color: colors.white,
  },
  userName: {
    ...typography.h3,
    color: colors.text,
  },
  userEmail: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: {
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body,
    color: colors.text,
  },
  settingSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    ...typography.h3,
    color: colors.textLight,
  },
  dangerText: {
    color: colors.error,
  },
  version: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
