/**
 * Premium Screen - Écran d'upgrade 5² Premium
 * Design minimaliste et moderne avec animations
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing } from '../theme';
import { Header, Button } from '../components';
import { usePremium } from '../hooks/usePremium';

const { width } = Dimensions.get('window');

// Composant pour les features
function FeatureItem({ icon, title, description, delay }: {
  icon: string;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <Animated.View 
      entering={FadeInDown.delay(delay).duration(400).springify()}
      style={styles.featureItem}
    >
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </Animated.View>
  );
}

// Composant pour le badge animé
function PremiumBadge() {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
    
    rotation.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(5, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.badgeContainer, animatedStyle]}>
      <Text style={styles.badgeText}>5²</Text>
      <Text style={styles.badgeSubtext}>PREMIUM</Text>
    </Animated.View>
  );
}

export function PremiumScreen() {
  const navigation = useNavigation();
  const { isPremium, isLoading, product, purchase, restore } = usePremium();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const result = await purchase();
      if (result.success) {
        Alert.alert(
          '🎉 Bienvenue au 5² !',
          'Tu as maintenant accès à 25 slots pour tes proches.',
          [{ text: 'Super !', onPress: handleBack }]
        );
      } else if (result.error) {
        if (result.error !== 'Achat annulé') {
          Alert.alert('Erreur', result.error);
        }
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const result = await restore();
      if (result.isPremium) {
        Alert.alert(
          '✅ Achat restauré',
          'Ton premium a été restauré avec succès !',
          [{ text: 'Super !', onPress: handleBack }]
        );
      } else {
        Alert.alert(
          'Aucun achat trouvé',
          'Aucun achat premium n\'a été trouvé pour ce compte.'
        );
      }
    } finally {
      setIsRestoring(false);
    }
  };

  // Si déjà premium, afficher un écran de confirmation
  if (isPremium) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title=""
          leftIcon={<Text style={styles.closeIcon}>×</Text>}
          onLeftPress={handleBack}
        />
        
        <View style={styles.alreadyPremiumContainer}>
          <PremiumBadge />
          <Animated.Text 
            entering={FadeInUp.delay(200).duration(400)}
            style={styles.alreadyPremiumTitle}
          >
            Tu es déjà Premium ! ✨
          </Animated.Text>
          <Animated.Text 
            entering={FadeInUp.delay(300).duration(400)}
            style={styles.alreadyPremiumSubtitle}
          >
            Profite de tes 25 slots pour rester connecté avec tous tes proches.
          </Animated.Text>
        </View>
      </SafeAreaView>
    );
  }

  const priceString = product?.priceString || '4.99 €';

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title=""
        leftIcon={<Text style={styles.closeIcon}>×</Text>}
        onLeftPress={handleBack}
      />

      <View style={styles.content}>
        {/* Hero Section */}
        <Animated.View 
          entering={FadeIn.duration(600)}
          style={styles.heroSection}
        >
          <PremiumBadge />
          
          <Animated.Text 
            entering={FadeInUp.delay(200).duration(400)}
            style={styles.title}
          >
            Passe au 5² Premium
          </Animated.Text>
          
          <Animated.Text 
            entering={FadeInUp.delay(300).duration(400)}
            style={styles.subtitle}
          >
            5 fois plus de connexions,{'\n'}une seule fois pour toujours.
          </Animated.Text>
        </Animated.View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <FeatureItem
            icon="👥"
            title="25 slots au lieu de 5"
            description="Plus de place pour tes proches"
            delay={400}
          />
          <FeatureItem
            icon="♾️"
            title="Achat à vie"
            description="Un paiement unique, pas d'abonnement"
            delay={500}
          />
          <FeatureItem
            icon="💜"
            title="Soutiens Cinq"
            description="Aide-nous à continuer le développement"
            delay={600}
          />
        </View>

        {/* CTA Section */}
        <Animated.View 
          entering={SlideInUp.delay(700).duration(400)}
          style={styles.ctaSection}
        >
          <TouchableOpacity
            style={styles.purchaseButton}
            onPress={handlePurchase}
            disabled={isPurchasing || isLoading}
            activeOpacity={0.8}
          >
            <View style={styles.purchaseButtonGradient}>
              {isPurchasing ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <>
                  <Text style={styles.purchaseButtonPrice}>{priceString}</Text>
                  <Text style={styles.purchaseButtonText}>Débloquer à vie</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Paiement unique • Sans abonnement • Sans renouvellement
          </Text>

          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={isRestoring}
          >
            {isRestoring ? (
              <ActivityIndicator color={colors.primary} size="small" />
            ) : (
              <Text style={styles.restoreButtonText}>
                Restaurer mes achats
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
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
    paddingHorizontal: spacing.lg,
  },
  closeIcon: {
    fontSize: 32,
    color: colors.text,
    fontWeight: '300',
  },
  
  // Hero
  heroSection: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  badgeContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  badgeText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
  },
  badgeSubtext: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
    opacity: 0.9,
    letterSpacing: 2,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Features
  featuresSection: {
    paddingVertical: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: spacing.sm,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  featureDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // CTA
  ctaSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  purchaseButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  purchaseButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.primary,
  },
  purchaseButtonPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
    marginRight: spacing.sm,
  },
  purchaseButtonText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.white,
  },
  disclaimer: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  restoreButton: {
    padding: spacing.md,
  },
  restoreButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '500',
  },

  // Already Premium
  alreadyPremiumContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  alreadyPremiumTitle: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  alreadyPremiumSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default PremiumScreen;
