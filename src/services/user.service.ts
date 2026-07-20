import api from './api';

export const userService = {
  getProfile: async () => {
    return api.get('/users/profile');
  },
  updateProfile: async (data: any) => {
    return api.patch('/users/profile', data);
  },
};