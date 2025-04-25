import React from 'react';
import { render } from '@testing-library/react';
import SplashScreen from '../../components/SplashScreen';

describe('SplashScreen', () => {
  it('renders consistently between server and client', () => {
    // Save original window
    const originalWindow = global.window;
    
    // Simulate server environment
    // @ts-ignore - Deliberately setting window to undefined to simulate server environment
    global.window = undefined;
    
    // Render on "server"
    const { container: serverContainer } = render(
      <SplashScreen minimumDisplayTime={0}>
        <div>Content</div>
      </SplashScreen>
    );
    
    const serverHTML = serverContainer.innerHTML;
    
    // Restore window for client rendering
    global.window = originalWindow;
    
    // Render on "client"
    const { container: clientContainer } = render(
      <SplashScreen minimumDisplayTime={0}>
        <div>Content</div>
      </SplashScreen>
    );
    
    const clientHTML = clientContainer.innerHTML;
    
    // The HTML structure should match to avoid hydration mismatches
    expect(serverHTML).toEqual(clientHTML);
  });
  
  it('uses consistent style properties between server and client', () => {
    const { getByTestId } = render(
      <SplashScreen minimumDisplayTime={0}>
        <div>Content</div>
      </SplashScreen>
    );
    
    const splashScreenElement = getByTestId('splash-screen');
    
    // Test that the element has the expected background style using toHaveStyle
    // instead of checking the attribute string directly
    expect(splashScreenElement).toHaveStyle({
      backgroundColor: 'var(--bg-primary, #ffffff)'
    });
  });
  
  it('applies consistent loading dot styles', () => {
    const { container } = render(
      <SplashScreen minimumDisplayTime={0}>
        <div>Content</div>
      </SplashScreen>
    );
    
    const loadingIndicator = container.querySelector('[data-testid="loading-indicator"]');
    expect(loadingIndicator).not.toBeNull();
    
    const loadingDots = container.querySelectorAll('.SplashScreen-module__loadingDot');
    expect(loadingDots.length).toBeGreaterThan(0);
    
    // Test that the first dot has the correct styles applied
    // Cast to HTMLElement first to resolve TypeScript issues with toHaveStyle
    const firstDot = loadingDots[0] as HTMLElement;
    expect(firstDot).toHaveStyle({
      backgroundColor: 'var(--accent-color, #0070f3)'
    });
  });
});
