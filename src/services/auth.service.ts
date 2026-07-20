import api from './api';

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// Mirrors the routes in fint-backend `src/auth/auth.controller.ts`
// (global prefix `/api/v1` is applied via axios baseURL).
export const authService = {
  signup: async (payload: SignupPayload): Promise<{ message: string; userId: string }> => {
    return api.post('/auth/signup', payload);
  },

  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    return api.post('/auth/login', payload);
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    return api.post('/auth/refresh', { refreshToken });
  },

  logout: async (): Promise<{ message: string }> => {
    return api.post('/auth/logout');
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    return api.post('/auth/reset-password', { token, newPassword });
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    return api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
  },

  // GET /auth/profile only returns the JWT payload (id, email, role).
  // GET /users/me returns the full user record (fullName etc.) — used to
  // hydrate the session on page reload.
  getProfile: async (): Promise<{ id: string; email: string; role: string }> => {
    return api.get('/auth/profile');
  },
};