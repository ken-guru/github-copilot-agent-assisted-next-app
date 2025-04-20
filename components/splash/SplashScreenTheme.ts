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

export const applyTheme = (isDark: boolean): void => {
  if (typeof document === 'undefined') return;

  if (isDark) {
    document.documentElement.classList.add('dark-mode');
    document.documentElement.classList.remove('light-mode');
  } else {
    document.documentElement.classList.add('light-mode');
    document.documentElement.classList.remove('dark-mode');
  }

  document.body.style.backgroundColor = isDark
    ? 'var(--bg-primary-dark, #121212)'
    : 'var(--bg-primary, #ffffff)';
};
