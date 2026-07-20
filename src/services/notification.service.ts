import api from './api';

export const notificationService = {
  getNotifications: async () => {
    return api.get('/notifications');
  },
  markAsRead: async (id: string) => {
    return api.patch(`/notifications/${id}/read`);
  },
};