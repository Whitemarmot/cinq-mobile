/**
 * Cinq Mobile App
 * 
 * App principale avec React Navigation et animations
 */

import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContext, useAuthProvider, PremiumContext, usePremiumProvider } from './src/hooks';
import { RootNavigator } from './src/navigation';
import { notificationService } from './src/services/notifications';

// Inner component that uses auth context
function AppContent() {
  const premium = usePremiumProvider();

  useEffect(() => {
    // Initialiser les notifications
    notificationService.initialize();
  }, []);

  return (
    <PremiumContext.Provider value={premium}>
      <RootNavigator />
    </PremiumContext.Provider>
  );
}

export default function App() {
  const auth = useAuthProvider();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AuthContext.Provider value={auth}>
          <AppContent />
        </AuthContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
