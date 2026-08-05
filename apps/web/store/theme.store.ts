export const themeStore = {
  theme: 'light' as 'light' | 'dark',
  setTheme(theme: 'light' | 'dark') {
    this.theme = theme;
  }
};