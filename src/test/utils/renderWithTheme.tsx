import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '../../context/theme/ThemeContext';

/**
 * Custom render function that includes ThemeProvider for testing components
 * that depend on theme context
 */
export function renderWithTheme(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );
  
  return render(ui, { wrapper: Wrapper, ...options });
}