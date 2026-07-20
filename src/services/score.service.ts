import api from './api';

export const scoreService = {
  getScore: async () => {
    return api.get('/score');
  },
  getInsights: async () => {
    return api.get('/score/insights');
  },
};