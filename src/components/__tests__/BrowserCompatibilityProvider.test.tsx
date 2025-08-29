/**
 * BrowserCompatibilityProvider Tests
 * 
 * Tests for the browser compatibility provider and related components.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  BrowserCompatibilityProvider,
  useBrowserCompatibility,
  useBrowserFeature,
  useBrowserInfo,
  FeatureGate,
  BrowserGate,
  DeviceGate,
  BrowserCompatibilityErrorBoundary,
} from '../BrowserCompatibilityProvider';

// Mock the browser compatibility utilities
jest.mock('../../utils/browser-compatibility', () => ({
  detectBrowserSupport: jest.fn(() => ({
    cssCustomProperties: true,
    cssGrid: true,
    flexbox: true,
    transforms: true,
    transitions: true,
    animations: true,
    backdropFilter: false,
    clipPath: true,
    containerQueries: false,
    aspectRatio: true,
    colorScheme: true,
    prefersReducedMotion: false,
    touchEvents: false,
    pointerEvents: true,
    intersectionObserver: true,
    resizeObserver: true,
  })),
  getBrowserInfo: jest.fn(() => ({
    name: 'chrome',
    version: '91',
    engine: 'blink',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  })),
  applyProgressiveEnhancement: jest.fn(),
  initializeBrowserCompatibility: jest.fn(),
}));

jest.mock('../../utils/performance-optimization', () => ({
  initializePerformanceOptimizations: jest.fn(),
}));

// Test component that uses the context
function TestComponent() {
  const { support, browserInfo, isLoading, error } = useBrowserCompatibility();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <div data-testid="css-grid-support">
        CSS Grid: {support?.cssGrid ? 'supported' : 'not supported'}
      </div>
      <div data-testid="browser-name">
        Browser: {browserInfo?.name}
      </div>
      <div data-testid="device-type">
        Device: {browserInfo?.isDesktop ? 'desktop' : 'mobile'}
      </div>
    </div>
  );
}

function FeatureTestComponent() {
  const hasAnimations = useBrowserFeature('animations');
  const hasBackdropFilter = useBrowserFeature('backdropFilter');
  
  return (
    <div>
      <div data-testid="animations-support">
        Animations: {hasAnimations ? 'supported' : 'not supported'}
      </div>
      <div data-testid="backdrop-filter-support">
        Backdrop Filter: {hasBackdropFilter ? 'supported' : 'not supported'}
      </div>
    </div>
  );
}

function BrowserInfoTestComponent() {
  const browserInfo = useBrowserInfo();
  
  return (
    <div>
      <div data-testid="browser-engine">
        Engine: {browserInfo?.engine}
      </div>
      <div data-testid="browser-version">
        Version: {browserInfo?.version}
      </div>
    </div>
  );
}

describe('BrowserCompatibilityProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide browser compatibility context', async () => {
    render(
      <BrowserCompatibilityProvider>
        <TestComponent />
      </BrowserCompatibilityProvider>
    );

    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for initialization to complete
    await waitFor(() => {
      expect(screen.getByTestId('css-grid-support')).toHaveTextContent('CSS Grid: supported');
    });

    expect(screen.getByTestId('browser-name')).toHaveTextContent('Browser: chrome');
    expect(screen.getByTestId('device-type')).toHaveTextContent('Device: desktop');
  });

  it('should handle initialization errors', async () => {
    const mockDetectBrowserSupport = require('../../utils/browser-compatibility').detectBrowserSupport;
    mockDetectBrowserSupport.mockImplementationOnce(() => {
      throw new Error('Browser detection failed');
    });

    render(
      <BrowserCompatibilityProvider>
        <TestComponent />
      </BrowserCompatibilityProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error: Browser detection failed')).toBeInTheDocument();
    });
  });

  it('should disable performance optimizations when requested', async () => {
    const mockInitializePerformanceOptimizations = require('../../utils/performance-optimization').initializePerformanceOptimizations;

    render(
      <BrowserCompatibilityProvider enablePerformanceOptimizations={false}>
        <TestComponent />
      </BrowserCompatibilityProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('browser-name')).toBeInTheDocument();
    });

    expect(mockInitializePerformanceOptimizations).not.toHaveBeenCalled();
  });

  it('should disable progressive enhancement when requested', async () => {
    const mockApplyProgressiveEnhancement = require('../../utils/browser-compatibility').applyProgressiveEnhancement;

    render(
      <BrowserCompatibilityProvider enableProgressiveEnhancement={false}>
        <TestComponent />
      </BrowserCompatibilityProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('browser-name')).toBeInTheDocument();
    });

    expect(mockApplyProgressiveEnhancement).not.toHaveBeenCalled();
  });
});

describe('useBrowserFeature', () => {
  it('should return correct feature support', async () => {
    render(
      <BrowserCompatibilityProvider>
        <FeatureTestComponent />
      </BrowserCompatibilityProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('animations-support')).toHaveTextContent('Animations: supported');
    });

    expect(screen.getByTestId('backdrop-filter-support')).toHaveTextContent('Backdrop Filter: not supported');
  });

  it('should return false when support is not available', async () => {
    const mockDetectBrowserSupport = require('../../utils/browser-compatibility').detectBrowserSupport;
    mockDetectBrowserSupport.mockReturnValueOnce({
      animations: false,
      backdropFilter: false,
    });

    render(
      <BrowserCompatibilityProvider>
        <FeatureTestComponent />
      </BrowserCompatibilityProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('animations-support')).toHaveTextContent('Animations: not supported');
    });
  });
});

describe('useBrowserInfo', () => {
  it('should return browser information', async () => {
    render(
      <BrowserCompatibilityProvider>
        <BrowserInfoTestComponent />
      </BrowserCompatibilityProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('browser-engine')).toHaveTextContent('Engine: blink');
    });

    expect(screen.getByTestId('browser-version')).toHaveTextContent('Version: 91');
  });
});

describe('FeatureGate', () => {
  it('should render children when feature is supported', async () => {
    render(
      <BrowserCompatibilityProvider>
        <FeatureGate feature="animations">
          <div data-testid="feature-content">Animations are supported!</div>
        </FeatureGate>
      </BrowserCompatibilityProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('feature-content')).toBeInTheDocument();
    });
  });

  it('should render fallback when feature is not supported', async () => {
    render(
      <BrowserCompatibilityProvider>
        <FeatureGate 
          feature="backdropFilter" 
          fallback={<div data-testid="fallback-content">Fallback content</div>}
        >
          <div data-testid="feature-content">Backdrop filter is supported!</div>
        </FeatureGate>
      </BrowserCompatibilityProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('fallback-content')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('feature-content')).not.toBeInTheDocument();
  });
});

describe('BrowserGate', () => {
  it('should render children for matching browser', async () => {
    render(
      <BrowserCompatibilityProvider>
        <BrowserGate browser="chrome">
          <div data-testid="chrome-content">Chrome-specific content</div>
        </BrowserGate>
      </BrowserCompatibilityProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('chrome-content')).toBeInTheDocument();
    });
  });

  it('should render fallback for non-matching browser', async () => {
    render(
      <BrowserCompatibilityProvider>
        <BrowserGate 
          browser="firefox" 
          fallback={<div data-testid="fallback-content">Not Firefox</div>}
        >
          <div data-testid="firefox-content">Firefox-specific content</div>
        </BrowserGate>
      </BrowserCompatibilityProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('fallback-content')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('firefox-content')).not.toBeInTheDocument();
  });

  it('should handle multiple browsers', async () => {
    render(
      <BrowserCompatibilityProvider>
        <BrowserGate browser={['chrome', 'firefox']}>
          <div data-testid="multi-browser-content">Multi-browser content</div>
        </BrowserGate>
      </BrowserCompatibilityProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('multi-browser-content')).toBeInTheDocument();
    });
  });
});

describe('DeviceGate', () => {
  it('should render children for matching device type', async () => {
    render(
      <BrowserCompatibilityProvider>
        <DeviceGate device="desktop">
          <div data-testid="desktop-content">Desktop-specific content</div>
        </DeviceGate>
      </BrowserCompatibilityProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('desktop-content')).toBeInTheDocument();
    });
  });

  it('should render fallback for non-matching device type', async () => {
    render(
      <BrowserCompatibilityProvider>
        <DeviceGate 
          device="mobile" 
          fallback={<div data-testid="fallback-content">Not mobile</div>}
        >
          <div data-testid="mobile-content">Mobile-specific content</div>
        </DeviceGate>
      </BrowserCompatibilityProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('fallback-content')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('mobile-content')).not.toBeInTheDocument();
  });

  it('should handle mobile device detection', async () => {
    const mockGetBrowserInfo = require('../../utils/browser-compatibility').getBrowserInfo;
    mockGetBrowserInfo.mockReturnValueOnce({
      name: 'chrome',
      version: '91',
      engine: 'blink',
      isMobile: true,
      isTablet: false,
      isDesktop: false,
    });

    render(
      <BrowserCompatibilityProvider>
        <DeviceGate device="mobile">
          <div data-testid="mobile-content">Mobile-specific content</div>
        </DeviceGate>
      </BrowserCompatibilityProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('mobile-content')).toBeInTheDocument();
    });
  });
});

describe('BrowserCompatibilityErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  function ThrowError() {
    throw new Error('Test error');
  }

  it('should catch and display browser compatibility errors', () => {
    render(
      <BrowserCompatibilityErrorBoundary>
        <ThrowError />
      </BrowserCompatibilityErrorBoundary>
    );

    expect(screen.getByText('Browser Compatibility Error')).toBeInTheDocument();
    expect(screen.getByText(/This application requires a modern browser/)).toBeInTheDocument();
  });

  it('should render custom fallback when provided', () => {
    render(
      <BrowserCompatibilityErrorBoundary 
        fallback={<div data-testid="custom-fallback">Custom error message</div>}
      >
        <ThrowError />
      </BrowserCompatibilityErrorBoundary>
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
  });

  it('should render children when no error occurs', () => {
    render(
      <BrowserCompatibilityErrorBoundary>
        <div data-testid="normal-content">Normal content</div>
      </BrowserCompatibilityErrorBoundary>
    );

    expect(screen.getByTestId('normal-content')).toBeInTheDocument();
  });
});

describe('Context usage outside provider', () => {
  it('should throw error when useBrowserCompatibility is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useBrowserCompatibility must be used within a BrowserCompatibilityProvider');

    console.error = originalError;
  });
});