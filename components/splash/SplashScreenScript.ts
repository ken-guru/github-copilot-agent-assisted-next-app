export const earlyThemeScript = `
  (function() {
    try {
      var isDark = false;
      
      // Check localStorage first
      var savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        isDark = savedTheme === 'dark';
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Then try system preference
        isDark = true;
      }
      
      // Apply theme class immediately
      if (isDark) {
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
      } else {
        document.documentElement.classList.add('light-mode');
        document.documentElement.classList.remove('dark-mode');
      }
      
      // Also apply to document body background to prevent any white flash
      document.body.style.backgroundColor = isDark ? 
        'var(--bg-primary-dark, #121212)' : 
        'var(--bg-primary, #ffffff)';
    } catch(e) {
      // Silently fail
    }
  })();
`;
