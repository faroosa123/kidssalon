'use client';

import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';
import toast from 'react-hot-toast';

class NotificationService {
  private static instance: NotificationService;
  private vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Request notification permission and get FCM token
  public async requestPermission(): Promise<string | null> {
    try {
      // Check if messaging is supported
      if (!messaging) {
        console.warn('Firebase messaging is not supported in this browser');
        return null;
      }

      // Request permission
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        
        // Get FCM token
        const token = await getToken(messaging, {
          vapidKey: this.vapidKey,
        });
        
        if (token) {
          console.log('FCM Token:', token);
          return token;
        } else {
          console.log('No registration token available.');
          return null;
        }
      } else {
        console.log('Unable to get permission to notify.');
        return null;
      }
    } catch (error) {
      console.error('An error occurred while retrieving token:', error);
      return null;
    }
  }

  // Listen for foreground messages
  public setupMessageListener(): void {
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      
      const { title, body } = payload.notification || {};
      
      if (title && body) {
        // Show toast notification for foreground messages
        toast.success(`${title}: ${body}`, {
          duration: 5000,
        });

        // Also show browser notification if page is not in focus
        if (document.hidden) {
          this.showBrowserNotification(title, body);
        }
      }
    });
  }

  // Show browser notification
  private showBrowserNotification(title: string, body: string, icon?: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'whatsapp-clone',
        requireInteraction: false,
      });

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }

  // Send notification to specific user (this would typically be done from backend)
  public async sendNotification(
    recipientToken: string,
    title: string,
    body: string,
    data?: Record<string, string>
  ): Promise<void> {
    // Note: In a production app, this should be done from your backend server
    // using the Firebase Admin SDK for security reasons
    console.log('Sending notification:', { recipientToken, title, body, data });
    
    try {
      // This is just a placeholder - actual implementation would require backend
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: recipientToken,
          title,
          body,
          data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  // Check if notifications are supported
  public isNotificationSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  // Get current notification permission status
  public getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }
}

export default NotificationService.getInstance();