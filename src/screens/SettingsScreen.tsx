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
import { Header, Button, PremiumBadgeInline } from '../components';
import { FadeInView, StaggeredList } from '../components/AnimatedComponents';
import { useAuth, usePremium } from '../hooks';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { user, logout } = useAuth();
  const { isPremium, maxSlots, restore } = usePremium();
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

  const handlePremium = () => {
    navigation.navigate('Premium');
  };

  const handleRestorePurchases = async () => {
    const result = await restore();
    if (result.isPremium) {
      Alert.alert('✅ Restauré', 'Ton premium a été restauré avec succès !');
    } else {
      Alert.alert('Aucun achat', 'Aucun achat premium trouvé pour ce compte.');
    }
  };

  const handleHelp = () => {
    Alert.alert('Bientôt', 'Cette fonctionnalité arrive bientôt !');
  };

  const handleAbout = () => {
    Alert.alert(
      'À propos de Cinq',
      `Cinq v1.0.0\n\nL'app pour rester connecté avec tes ${maxSlots} personnes les plus proches.\n\n❤️ Made with love`
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
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(user?.displayName || user?.username || 'U')[0].toUpperCase()}
              </Text>
            </View>
            {isPremium && (
              <View style={styles.premiumBadgePosition}>
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>5²</Text>
                </View>
              </View>
            )}
          </View>
          <View style={styles.profileNameRow}>
            <Text style={styles.profileName}>
              {user?.displayName || user?.username}
            </Text>
            {isPremium && <PremiumBadgeInline />}
          </View>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <Text style={styles.slotInfo}>
            {isPremium ? '25 slots disponibles' : '5 slots gratuits'}
          </Text>
        </Animated.View>

        {/* Premium Section */}
        {!isPremium && (
          <FadeInView delay={200}>
            <TouchableOpacity 
              style={styles.premiumBanner} 
              onPress={handlePremium}
              activeOpacity={0.8}
            >
              <View style={styles.premiumBannerContent}>
                <Text style={styles.premiumBannerIcon}>✨</Text>
                <View style={styles.premiumBannerText}>
                  <Text style={styles.premiumBannerTitle}>Passe au 5² Premium</Text>
                  <Text style={styles.premiumBannerSubtitle}>25 slots • 4.99€ à vie</Text>
                </View>
              </View>
              <Text style={styles.premiumBannerChevron}>›</Text>
            </TouchableOpacity>
          </FadeInView>
        )}

        {/* Settings Groups */}
        <FadeInView delay={250}>
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
            <Text style={styles.sectionTitle}>Premium</Text>
            {isPremium ? (
              <SettingItem
                icon="💎"
                title="5² Premium actif"
                subtitle="Merci pour ton soutien !"
                onPress={handlePremium}
              />
            ) : (
              <SettingItem
                icon="⭐"
                title="Débloquer 5² Premium"
                subtitle="25 slots pour 4.99€ à vie"
                onPress={handlePremium}
              />
            )}
            <SettingItem
              icon="🔄"
              title="Restaurer mes achats"
              subtitle="Si tu as déjà acheté"
              onPress={handleRestorePurchases}
            />
          </View>
        </FadeInView>

        <FadeInView delay={350}>
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

        <FadeInView delay={450}>
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
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  premiumBadgePosition: {
    position: 'absolute',
    bottom: -4,
    right: -4,
  },
  premiumBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.violet,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  slotInfo: {
    ...typography.bodySmall,
    color: colors.primary,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  
  // Premium Banner
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 16,
  },
  premiumBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumBannerIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  premiumBannerText: {},
  premiumBannerTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.white,
  },
  premiumBannerSubtitle: {
    ...typography.bodySmall,
    color: colors.white,
    opacity: 0.9,
  },
  premiumBannerChevron: {
    fontSize: 24,
    color: colors.white,
    opacity: 0.8,
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
