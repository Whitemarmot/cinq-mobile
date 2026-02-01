/**
 * Navigation Types
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Main Tab
export type MainTabParamList = {
  Home: undefined;
  Feed: undefined;
};

// Main Stack
export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Chat: { conversationId: string; contactName: string };
  Settings: undefined;
};

// Screen Props
export type AuthScreenProps<T extends keyof AuthStackParamList> = 
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = 
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<MainStackParamList>
  >;

export type MainStackScreenProps<T extends keyof MainStackParamList> = 
  NativeStackScreenProps<MainStackParamList, T>;

// Legacy types for backwards compatibility
export type RootStackParamList = AuthStackParamList & MainStackParamList;
