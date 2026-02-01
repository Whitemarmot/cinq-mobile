/**
 * Cinq Mobile App
 * 
 * App principale - Gère l'authentification et la navigation de base
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContext, useAuthProvider } from './src/hooks';
import { colors } from './src/theme';

// Screens
import {
  LoginScreen,
  RegisterScreen,
  AppScreen,
  FeedScreen,
  ChatScreen,
  SettingsScreen,
} from './src/screens';

type Screen = 'login' | 'register' | 'app' | 'feed' | 'chat' | 'settings';

interface ChatParams {
  conversationId: string;
  contactName: string;
}

function AppContent() {
  const auth = useAuthProvider();
  const [currentScreen, setCurrentScreen] = React.useState<Screen>('app');
  const [chatParams, setChatParams] = React.useState<ChatParams | null>(null);

  // Loading state
  if (auth.isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Auth screens
  if (!auth.isAuthenticated) {
    return (
      <AuthContext.Provider value={auth}>
        {currentScreen === 'register' ? (
          <RegisterScreen onNavigateToLogin={() => setCurrentScreen('login')} />
        ) : (
          <LoginScreen onNavigateToRegister={() => setCurrentScreen('register')} />
        )}
      </AuthContext.Provider>
    );
  }

  // Main app screens
  const renderScreen = () => {
    switch (currentScreen) {
      case 'settings':
        return <SettingsScreen onBack={() => setCurrentScreen('app')} />;
      
      case 'feed':
        return <FeedScreen />;
      
      case 'chat':
        if (!chatParams) return null;
        return (
          <ChatScreen
            conversationId={chatParams.conversationId}
            contactName={chatParams.contactName}
            onBack={() => setCurrentScreen('app')}
          />
        );
      
      case 'app':
      default:
        return (
          <AppScreen
            onContactPress={(slot) => {
              // TODO: Get conversation ID from contact slot
              setChatParams({
                conversationId: `conv-${slot}`,
                contactName: `Contact ${slot}`,
              });
              setCurrentScreen('chat');
            }}
            onSettingsPress={() => setCurrentScreen('settings')}
          />
        );
    }
  };

  return (
    <AuthContext.Provider value={auth}>
      {renderScreen()}
    </AuthContext.Provider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
