export const isDarkTheme = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
};
