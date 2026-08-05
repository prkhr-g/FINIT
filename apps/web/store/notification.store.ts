export const notificationStore = {
  notifications: [] as any[],
  setNotifications(notifs: any[]) {
    this.notifications = notifs;
  }
};