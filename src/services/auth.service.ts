import api from './api';

export const authService = {
  login: async (credentials: any) => {
    return api.post('/auth/login', credentials);
  },
  signup: async (userData: any) => {
    return api.post('/auth/register', userData);
  },
  logout: async () => {
    return api.post('/auth/logout');
  },
  getCurrentUser: async () => {
    return api.get('/auth/me');
  },
};