/**
 * Service de notifications push avec Expo
 */

import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  private static expoPushToken: string | null = null;

  /**
   * Demander les permissions et obtenir le push token
   */
  static async registerForPushNotifications(): Promise<string | null> {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Permission de notification refusée');
        return null;
      }

      const projectId = Constants?.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        console.warn('Project ID manquant pour les notifications');
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({ projectId });
      this.expoPushToken = token.data;
      
      console.log('Push token:', token.data);
      return token.data;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des notifications:', error);
      return null;
    }
  }

  /**
   * Écouter les notifications entrantes
   */
  static addNotificationListener(
    handler: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(handler);
  }

  /**
   * Écouter les interactions avec les notifications (tap, etc.)
   */
  static addNotificationResponseListener(
    handler: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(handler);
  }

  /**
   * Envoyer une notification locale (pour test)
   */
  static async scheduleLocalNotification(
    title: string, 
    body: string, 
    data?: any,
    seconds: number = 0
  ) {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: seconds > 0 ? { seconds } : null,
    });
  }

  /**
   * Annuler toutes les notifications programmées
   */
  static async cancelAllScheduledNotifications() {
    return await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Obtenir le nombre de notifications en attente
   */
  static async getPendingNotificationCount(): Promise<number> {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications.length;
  }

  /**
   * Obtenir le push token actuel
   */
  static getPushToken(): string | null {
    return this.expoPushToken;
  }
}

// Service de notifications pour Cinq
export class CinqNotificationService {
  /**
   * Initialiser le service de notifications pour Cinq
   */
  static async initialize() {
    try {
      const pushToken = await NotificationService.registerForPushNotifications();
      
      if (pushToken) {
        // TODO: Envoyer le push token au backend Supabase
        console.log('Push token pour Cinq:', pushToken);
      }

      // Écouter les notifications
      NotificationService.addNotificationListener((notification) => {
        console.log('Notification reçue:', notification);
        
        // Gérer les différents types de notifications
        const { type } = notification.request.content.data || {};
        
        switch (type) {
          case 'message':
            // Nouveau message
            break;
          case 'contact_request':
            // Demande de contact
            break;
          case 'post_like':
            // Like sur un post
            break;
          default:
            console.log('Type de notification inconnu:', type);
        }
      });

      // Écouter les interactions
      NotificationService.addNotificationResponseListener((response) => {
        console.log('Interaction avec notification:', response);
        
        const { type } = response.notification.request.content.data || {};
        
        switch (type) {
          case 'message':
            // Naviguer vers le chat
            // TODO: Utiliser NavigationService
            break;
          case 'contact_request':
            // Naviguer vers les paramètres
            break;
        }
      });

    } catch (error) {
      console.error('Erreur lors de l\'initialisation des notifications:', error);
    }
  }

  /**
   * Notifier un nouveau message
   */
  static async notifyNewMessage(
    senderName: string, 
    message: string, 
    conversationId: string
  ) {
    await NotificationService.scheduleLocalNotification(
      `Nouveau message de ${senderName}`,
      message,
      { 
        type: 'message', 
        conversationId 
      }
    );
  }

  /**
   * Notifier une demande de contact
   */
  static async notifyContactRequest(senderName: string) {
    await NotificationService.scheduleLocalNotification(
      'Nouvelle demande de contact',
      `${senderName} veut être dans tes 5`,
      { type: 'contact_request' }
    );
  }

  /**
   * Notifier un like sur un post
   */
  static async notifyPostLike(likerName: string) {
    await NotificationService.scheduleLocalNotification(
      'Nouveau like',
      `${likerName} aime ton post`,
      { type: 'post_like' }
    );
  }
}

export const notificationService = CinqNotificationService;
export default notificationService;