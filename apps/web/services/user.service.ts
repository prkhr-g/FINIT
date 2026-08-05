import api from './api';

// Matches fint-backend `src/users/users.controller.ts`, which exposes the
// logged-in user's own record under /users/me (no :id route).
export const userService = {
  getProfile: async () => {
    return api.get('/users/me');
  },
  updateAccount: async (data: any) => {
    return api.patch('/users/me', data);
  },
  updateProfile: async (data: any) => {
    return api.patch('/users/me/profile', data);
  },
};