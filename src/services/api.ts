import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getStoredToken } from '@/lib/auth';

// Backend (Nest) listens on port 3000 by default and is globally prefixed
// with /api/v1 (see src/main.ts in fint-backend). Override with
// NEXT_PUBLIC_API_URL in .env.local if your backend runs elsewhere.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: any) => {
    const rawMessage = error.response?.data?.message;
    // NestJS's ValidationPipe returns `message` as an array of strings
    // (one per failed validation rule) instead of a single string.
    const message = Array.isArray(rawMessage)
      ? rawMessage.join(', ')
      : rawMessage || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;