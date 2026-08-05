const ACCESS_TOKEN_KEY = 'fint_token';
const REFRESH_TOKEN_KEY = 'fint_refresh_token';

// ─── Access token ─────────────────────────────────────────────────────────
export const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setStoredToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const removeStoredToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

// ─── Refresh token ────────────────────────────────────────────────────────
export const getStoredRefreshToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setStoredRefreshToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const removeStoredRefreshToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// ─── Clear everything on logout ──────────────────────────────────────────
export const clearStoredAuth = () => {
  removeStoredToken();
  removeStoredRefreshToken();
};