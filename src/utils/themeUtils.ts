// Utility function to check dark mode state
export const getIsDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('dark-mode') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches &&
     !document.documentElement.classList.contains('light-mode'));
};