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
import { AuthContext, useAuthProvider } from './src/hooks';
import { RootNavigator } from './src/navigation';
import { notificationService } from './src/services/notifications';

export default function App() {
  const auth = useAuthProvider();

  useEffect(() => {
    // Initialiser les notifications
    notificationService.initialize();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AuthContext.Provider value={auth}>
          <RootNavigator />
        </AuthContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
