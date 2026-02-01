/**
 * Main Navigator - Tab navigator pour l'app principale
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, StyleSheet } from 'react-native';
import { AppScreen, FeedScreen, ChatScreen, SettingsScreen, PremiumScreen } from '../screens';
import { colors } from '../theme';

// Types
export type MainTabParamList = {
  Home: undefined;
  Feed: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  Chat: { conversationId: string; contactName: string };
  Settings: undefined;
  Premium: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

// Tab Icons
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const icons: Record<string, string> = {
    Home: '🏠',
    Feed: '📱',
  };
  
  return (
    <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
      {icons[name]}
    </Text>
  );
};

// Main Tabs
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={AppScreen} 
        options={{ tabBarLabel: 'Mes 5' }}
      />
      <Tab.Screen 
        name="Feed" 
        component={FeedScreen} 
        options={{ tabBarLabel: 'Feed' }}
      />
    </Tab.Navigator>
  );
}

// Main Stack (includes tabs + modal screens)
export function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="Premium" 
        component={PremiumScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: 8,
    height: 80,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  tabIcon: {
    fontSize: 24,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
  },
});
