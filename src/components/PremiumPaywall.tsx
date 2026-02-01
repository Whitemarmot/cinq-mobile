/**
 * Premium Paywall Modal
 * S'affiche quand l'utilisateur essaie d'ajouter plus de 5 contacts (gratuit)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  SlideInDown,
} from 'react-native-reanimated';
import { colors, typography, spacing } from '../theme';
import { usePremium } from '../hooks/usePremium';

interface PremiumPaywallProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const { height } = Dimensions.get('window');

export function PremiumPaywall({ visible, onClose, onSuccess }: PremiumPaywallProps) {
  const { product, purchase, restore } = usePremium();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const result = await purchase();
      if (result.success) {
        onSuccess?.();
        onClose();
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
        onSuccess?.();
        onClose();
      }
    } finally {
      setIsRestoring(false);
    }
  };

  const priceString = product?.priceString || '4.99 €';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View 
        entering={FadeIn.duration(200)}
        style={styles.overlay}
      >
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View 
          entering={SlideInDown.duration(300).springify()}
          style={styles.modal}
        >
          {/* Handle */}
          <View style={styles.handle} />
          
          {/* Content */}
          <View style={styles.content}>
            {/* Emoji + Title */}
            <Animated.View 
              entering={FadeInUp.delay(100).duration(300)}
              style={styles.header}
            >
              <Text style={styles.emoji}>😅</Text>
              <Text style={styles.title}>Tes 5 places sont prises !</Text>
              <Text style={styles.subtitle}>
                Passe au 5² pour débloquer{' '}
                <Text style={styles.highlight}>25 places</Text>
              </Text>
            </Animated.View>

            {/* Features compact */}
            <Animated.View 
              entering={FadeInUp.delay(200).duration(300)}
              style={styles.featuresRow}
            >
              <View style={styles.featureChip}>
                <Text style={styles.featureChipText}>👥 25 slots</Text>
              </View>
              <View style={styles.featureChip}>
                <Text style={styles.featureChipText}>♾️ À vie</Text>
              </View>
              <View style={styles.featureChip}>
                <Text style={styles.featureChipText}>💜 Un seul paiement</Text>
              </View>
            </Animated.View>

            {/* CTA */}
            <Animated.View 
              entering={FadeInUp.delay(300).duration(300)}
              style={styles.ctaContainer}
            >
              <TouchableOpacity
                style={styles.purchaseButton}
                onPress={handlePurchase}
                disabled={isPurchasing}
                activeOpacity={0.8}
              >
                {isPurchasing ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <>
                    <Text style={styles.purchasePrice}>{priceString}</Text>
                    <Text style={styles.purchaseText}>Débloquer 5²</Text>
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.secondaryActions}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleRestore}
                  disabled={isRestoring}
                >
                  {isRestoring ? (
                    <ActivityIndicator color={colors.primary} size="small" />
                  ) : (
                    <Text style={styles.secondaryButtonText}>Restaurer</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={onClose}
                >
                  <Text style={styles.secondaryButtonText}>Plus tard</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: spacing.xl + 20, // Safe area
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.gray[300],
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  highlight: {
    color: colors.primary,
    fontWeight: '700',
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  featureChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  featureChipText: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '500',
  },
  ctaContainer: {
    alignItems: 'center',
  },
  purchaseButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 4,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  purchasePrice: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
    marginRight: spacing.sm,
  },
  purchaseText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.white,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  secondaryButton: {
    padding: spacing.sm,
  },
  secondaryButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default PremiumPaywall;
