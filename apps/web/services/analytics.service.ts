import api from './api';

export const analyticsService = {
  getDashboardData: async () => {
    return api.get('/analytics/dashboard');
  },
  getTrends: async (metric: string) => {
    return api.get(`/analytics/trends/${metric}`);
  },
};