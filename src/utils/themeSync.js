/**
 * Theme synchronization utility to prevent hydration mismatches
 * This script ensures theme variables are consistent between server and client
 */

// Detect theme preference and apply it before initial render to prevent flashing
export const initializeTheme = () => {
  // Function that will run in the browser to set the correct theme before render
  const themeInitScript = `
    (function() {
      try {
        // Check if user has previously selected a theme
        const storedTheme = localStorage.getItem('theme');
        // Check if user has OS-level preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Determine which theme to use (stored preference or OS preference)
        const theme = storedTheme || (prefersDark ? 'dark' : 'light');
        
        // Apply theme class to HTML element before render
        document.documentElement.classList.toggle('dark-mode', theme === 'dark');
        
        // Store theme variable for hydration
        window.__THEME_PREFERENCE = theme;
      } catch (e) {
        // Fallback to default theme
        console.error('Failed to initialize theme:', e);
      }
    })();
  `;
  
  return themeInitScript;
};

// Helper function to safely access theme variables
export const getThemeVariable = (lightVar, darkVar, fallback) => {
  // In the browser, check if dark mode is active
  if (typeof window !== 'undefined') {
    const isDarkMode = document.documentElement.classList.contains('dark-mode');
    return `var(${isDarkMode ? darkVar : lightVar}, ${fallback})`;
  }
  
  // During SSR, use light theme with fallback
  return `var(${lightVar}, ${fallback})`;
};

// Helper to get correct style attribute format for React
export const getThemeStyle = (property, lightVar, darkVar, fallback) => {
  const value = getThemeVariable(lightVar, darkVar, fallback);
  
  // Convert CSS property from kebab-case to camelCase
  const camelCaseProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  
  return { [camelCaseProperty]: value };
};

// Create a style object that works with both SSR and CSR
export const createThemeStyles = (styles) => {
  const themeStyles = {};
  
  Object.entries(styles).forEach(([property, values]) => {
    const { light, dark, fallback } = values;
    themeStyles[property] = getThemeVariable(light, dark, fallback);
  });
  
  return themeStyles;
};
