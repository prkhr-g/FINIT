export const authStore = {
  user: null as any,
  isAuthenticated: false,
  setUser(user: any) {
    this.user = user;
    this.isAuthenticated = !!user;
  }
};