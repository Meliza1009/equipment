import api from '../utils/axios';

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  createdAt: string;
  readAt?: string;
}

export const notificationService = {
  // Get all notifications for current user
  getNotifications: async (): Promise<Notification[]> => {
    const response = await api.get('/notifications');
    return response.data;
  },

  // Get unread notifications count
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id: number): Promise<Notification> => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },

  // Delete notification
  deleteNotification: async (id: number): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },

  // Subscribe to FCM notifications
  subscribeToPushNotifications: async (fcmToken: string): Promise<void> => {
    await api.post('/notifications/subscribe', { fcmToken });
  },

  // Unsubscribe from FCM notifications
  unsubscribeFromPushNotifications: async (): Promise<void> => {
    await api.post('/notifications/unsubscribe');
  },
};
