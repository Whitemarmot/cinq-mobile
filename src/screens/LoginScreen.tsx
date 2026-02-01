/**
 * Login Screen avec animations
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { Button, Input } from '../components';
import { ShakeView, PulseView } from '../components/AnimatedComponents';
import { useAuth } from '../hooks';
import type { AuthStackParamList } from '../navigation/types';

type LoginNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
  const navigation = useNavigation<LoginNavProp>();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shakeError, setShakeError] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Veuillez remplir tous les champs');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await login(email.trim(), password);
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Animated.View 
          entering={FadeInDown.duration(600).springify()}
          style={styles.header}
        >
          <PulseView duration={3000} minScale={0.98} maxScale={1.02}>
            <Text style={styles.logo}>cinq</Text>
          </PulseView>
          <Text style={styles.subtitle}>Tes 5 personnes les plus proches</Text>
        </Animated.View>

        <ShakeView trigger={shakeError} style={styles.form}>
          <Animated.View entering={FadeInUp.delay(200).duration(400)}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="votre@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300).duration(400)}>
            <Input
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              rightIcon={<Text>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />
          </Animated.View>

          {error ? (
            <Animated.Text 
              entering={FadeInUp.duration(200)} 
              style={styles.error}
            >
              {error}
            </Animated.Text>
          ) : null}

          <Animated.View entering={FadeInUp.delay(400).duration(400)}>
            <Button
              title="Se connecter"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={styles.button}
            />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500).duration(400)}>
            <Button
              title="Créer un compte"
              onPress={handleNavigateToRegister}
              variant="ghost"
              fullWidth
            />
          </Animated.View>
        </ShakeView>
      </KeyboardAvoidingView>
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
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  form: {
    width: '100%',
  },
  error: {
    ...typography.bodySmall,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
});
