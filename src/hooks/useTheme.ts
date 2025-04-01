'use client';

import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Hook to access and control the current theme
 * @returns Theme state and control functions
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}