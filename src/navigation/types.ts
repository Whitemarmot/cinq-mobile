/**
 * Navigation Types
 */

export type RootStackParamList = {
  // Auth Stack
  Login: undefined;
  Register: undefined;
  
  // Main Stack
  Main: undefined;
  Chat: { conversationId: string; contactName: string };
  Settings: undefined;
};

export type MainTabParamList = {
  App: undefined;
  Feed: undefined;
  Messages: undefined;
};
