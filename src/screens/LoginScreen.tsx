/**
 * Login Screen
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, typography, spacing } from '../theme';
import { Button, Input } from '../components';
import { useAuth } from '../hooks';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
}

export function LoginScreen({ onNavigateToRegister }: LoginScreenProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await login(email.trim(), password);
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>cinq</Text>
          <Text style={styles.subtitle}>Tes 5 personnes les plus proches</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="votre@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            rightIcon={<Text>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            title="Se connecter"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            style={styles.button}
          />

          <Button
            title="Créer un compte"
            onPress={onNavigateToRegister}
            variant="ghost"
            fullWidth
          />
        </View>
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
