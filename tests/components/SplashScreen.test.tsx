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
    const { container } = render(
      <SplashScreen minimumDisplayTime={0}>
        <div>Content</div>
      </SplashScreen>
    );
    
    const splashScreenElement = container.querySelector('[data-testid="splash-screen"]');
    
    // Verify style property exists
    expect(splashScreenElement).not.toBeNull();
    
    // Check if inline styles use camelCase format (React's standard)
    const styleAttribute = splashScreenElement?.getAttribute('style');
    expect(styleAttribute).toContain('backgroundColor');
    expect(styleAttribute).not.toContain('background-color');
    
    // Check that we're using consistent CSS variables
    expect(styleAttribute).toContain('var(--bg-primary');
  });
  
  it('applies consistent loading dot styles', () => {
    const { container } = render(
      <SplashScreen minimumDisplayTime={0}>
        <div>Content</div>
      </SplashScreen>
    );
    
    const loadingDots = container.querySelectorAll('.SplashScreen-module__loadingDot');
    expect(loadingDots.length).toBeGreaterThan(0);
    
    loadingDots.forEach(dot => {
      const styleAttribute = dot.getAttribute('style');
      // Check for camelCase style properties
      expect(styleAttribute).toContain('backgroundColor');
      expect(styleAttribute).not.toContain('background-color');
      
      // Check for consistent variable use
      expect(styleAttribute).toContain('var(--accent-color');
    });
  });
});
