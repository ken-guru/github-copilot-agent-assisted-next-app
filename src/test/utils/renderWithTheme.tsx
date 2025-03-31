import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ThemeProvider } from '@/context/theme/ThemeContext';

/**
 * Custom render function that wraps components with ThemeProvider
 * @param ui - The React component to render
 * @param options - Additional render options
 * @returns The rendered component with all testing utilities
 */
export function renderWithTheme(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, {
    wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    ...options,
  });
}

/**
 * HOC to wrap a component with ThemeProvider for testing
 * @param Component - The component to wrap
 * @returns The wrapped component
 */
export function withTheme<P>(Component: React.ComponentType<P>): React.FC<P> {
  const WithThemeComponent = (props: P) => (
    <ThemeProvider>
      <Component {...props} />
    </ThemeProvider>
  );
  WithThemeComponent.displayName = `WithTheme(${Component.displayName || Component.name || 'Component'})`;
  return WithThemeComponent;
}