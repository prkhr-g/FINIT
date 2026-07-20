export const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('fint_token');
};

export const setStoredToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('fint_token', token);
};

export const removeStoredToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('fint_token');
};