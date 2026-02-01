/**
 * Register Screen avec animations
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { Button, Input } from '../components';
import { ShakeView, PulseView } from '../components/AnimatedComponents';
import { useAuth } from '../hooks';
import type { AuthStackParamList } from '../navigation/types';

type RegisterNavProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export function RegisterScreen() {
  const navigation = useNavigation<RegisterNavProp>();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shakeError, setShakeError] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
      });
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            entering={FadeInDown.duration(600).springify()}
            style={styles.header}
          >
            <PulseView duration={3000} minScale={0.98} maxScale={1.02}>
              <Text style={styles.logo}>cinq</Text>
            </PulseView>
            <Text style={styles.subtitle}>Rejoins l'aventure</Text>
          </Animated.View>

          <ShakeView trigger={shakeError} style={styles.form}>
            <Animated.View entering={FadeInUp.delay(100).duration(400)}>
              <Input
                label="Nom d'utilisateur"
                value={username}
                onChangeText={setUsername}
                placeholder="tonpseudo"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Animated.View>

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

            <Animated.View entering={FadeInUp.delay(400).duration(400)}>
              <Input
                label="Confirmer le mot de passe"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
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

            <Animated.View entering={FadeInUp.delay(500).duration(400)}>
              <Button
                title="Créer mon compte"
                onPress={handleRegister}
                loading={isLoading}
                fullWidth
                style={styles.button}
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(600).duration(400)}>
              <Button
                title="J'ai déjà un compte"
                onPress={handleNavigateToLogin}
                variant="ghost"
                fullWidth
              />
            </Animated.View>
          </ShakeView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
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
