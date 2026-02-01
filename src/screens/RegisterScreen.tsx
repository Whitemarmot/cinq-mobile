/**
 * Register Screen
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { colors, typography, spacing } from '../theme';
import { Button, Input } from '../components';
import { useAuth } from '../hooks';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export function RegisterScreen({ onNavigateToLogin }: RegisterScreenProps) {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit faire au moins 8 caractères');
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.logo}>cinq</Text>
            <Text style={styles.subtitle}>Rejoins le cercle</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Nom d'utilisateur"
              value={username}
              onChangeText={setUsername}
              placeholder="tonpseudo"
              autoCapitalize="none"
              autoCorrect={false}
            />

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

            <Input
              label="Confirmer le mot de passe"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
              title="S'inscrire"
              onPress={handleRegister}
              loading={isLoading}
              fullWidth
              style={styles.button}
            />

            <Button
              title="Déjà un compte ? Se connecter"
              onPress={onNavigateToLogin}
              variant="ghost"
              fullWidth
            />
          </View>
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
