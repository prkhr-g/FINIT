import api from './api';

export const aiService = {
  sendMessage: async (message: string) => {
    return api.post('/ai/chat', { message });
  },
  getRecommendations: async () => {
    return api.get('/ai/recommendations');
  },
};