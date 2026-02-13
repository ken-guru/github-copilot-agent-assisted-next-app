import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/colors';

type ThemeMode = 'light' | 'dark' | 'system';
type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  colors: typeof Colors.light;
  colorScheme: ColorScheme;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('system');
  
  const actualScheme: ColorScheme = theme === 'system' 
    ? (systemScheme || 'light') 
    : theme as ColorScheme;
    
  const colors = Colors[actualScheme];

  useEffect(() => {
    AsyncStorage.getItem('theme').then(storedTheme => {
      if (storedTheme) {
        setThemeState(storedTheme as ThemeMode);
      }
    });
  }, []);

  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, colorScheme: actualScheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
