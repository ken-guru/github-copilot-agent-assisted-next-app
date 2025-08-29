/**
 * Browser Compatibility Provider
 * 
 * React component that initializes browser compatibility features
 * and provides context for Material 3 Expressive components.
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  detectBrowserSupport, 
  getBrowserInfo, 
  applyProgressiveEnhancement,
  initializeBrowserCompatibility,
  type BrowserSupport 
} from '../utils/browser-compatibility';
import { initializePerformanceOptimizations } from '../utils/performance-optimization';

interface BrowserCompatibilityContextType {
  support: BrowserSupport | null;
  browserInfo: ReturnType<typeof getBrowserInfo> | null;
  isLoading: boolean;
  error: string | null;
}

const BrowserCompatibilityContext = createContext<BrowserCompatibilityContextType>({
  support: null,
  browserInfo: null,
  isLoading: true,
  error: null,
});

export const useBrowserCompatibility = () => {
  const context = useContext(BrowserCompatibilityContext);
  if (!context) {
    throw new Error('useBrowserCompatibility must be used within a BrowserCompatibilityProvider');
  }
  return context;
};

interface BrowserCompatibilityProviderProps {
  children: ReactNode;
  enablePerformanceOptimizations?: boolean;
  enableProgressiveEnhancement?: boolean;
}

export function BrowserCompatibilityProvider({
  children,
  enablePerformanceOptimizations = true,
  enableProgressiveEnhancement = true,
}: BrowserCompatibilityProviderProps) {
  const [support, setSupport] = useState<BrowserSupport | null>(null);
  const [browserInfo, setBrowserInfo] = useState<ReturnType<typeof getBrowserInfo> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeCompatibility = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Detect browser support
        const detectedSupport = detectBrowserSupport();
        setSupport(detectedSupport);

        // Get browser information
        const detectedBrowserInfo = getBrowserInfo();
        setBrowserInfo(detectedBrowserInfo);

        // Apply progressive enhancement
        if (enableProgressiveEnhancement) {
          applyProgressiveEnhancement(detectedSupport);
        }

        // Initialize browser compatibility features
        initializeBrowserCompatibility();

        // Initialize performance optimizations
        if (enablePerformanceOptimizations) {
          initializePerformanceOptimizations();
        }

        // Load browser-specific CSS
        await loadBrowserSpecificCSS(detectedSupport, detectedBrowserInfo);

        setIsLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        setIsLoading(false);
        console.error('Browser compatibility initialization failed:', err);
      }
    };

    initializeCompatibility();
  }, [enablePerformanceOptimizations, enableProgressiveEnhancement]);

  const contextValue: BrowserCompatibilityContextType = {
    support,
    browserInfo,
    isLoading,
    error,
  };

  return (
    <BrowserCompatibilityContext.Provider value={contextValue}>
      {children}
    </BrowserCompatibilityContext.Provider>
  );
}

/**
 * Load browser-specific CSS based on detected capabilities
 */
async function loadBrowserSpecificCSS(
  support: BrowserSupport,
  browserInfo: ReturnType<typeof getBrowserInfo>
): Promise<void> {
  const cssToLoad: string[] = [];

  // Always load fallback CSS
  cssToLoad.push('/styles/browser-fallbacks.css');

  // Load mobile-specific CSS for mobile devices
  if (browserInfo.isMobile || browserInfo.isTablet) {
    cssToLoad.push('/styles/material3-mobile.css');
  }

  // Load animation CSS only if animations are supported
  if (support.animations && support.transitions) {
    cssToLoad.push('/styles/material3-animations.css');
  }

  // Load accessibility CSS
  cssToLoad.push('/styles/material3-accessibility.css');

  // Load CSS files
  const loadPromises = cssToLoad.map(cssPath => {
    return new Promise<void>((resolve, reject) => {
      // Check if CSS is already loaded
      const existingLink = document.querySelector(`link[href="${cssPath}"]`);
      if (existingLink) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssPath;
      
      link.onload = () => resolve();
      link.onerror = () => {
        console.warn(`Failed to load CSS: ${cssPath}`);
        resolve(); // Don't reject, just warn
      };
      
      document.head.appendChild(link);
    });
  });

  await Promise.all(loadPromises);
}

/**
 * Hook for checking specific browser features
 */
export function useBrowserFeature(feature: keyof BrowserSupport): boolean {
  const { support } = useBrowserCompatibility();
  return support?.[feature] ?? false;
}

/**
 * Hook for getting browser information
 */
export function useBrowserInfo() {
  const { browserInfo } = useBrowserCompatibility();
  return browserInfo;
}

/**
 * Component for conditionally rendering based on browser support
 */
interface FeatureGateProps {
  feature: keyof BrowserSupport;
  fallback?: ReactNode;
  children: ReactNode;
}

export function FeatureGate({ feature, fallback, children }: FeatureGateProps) {
  const isSupported = useBrowserFeature(feature);
  
  if (isSupported) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}

/**
 * Component for browser-specific rendering
 */
interface BrowserGateProps {
  browser: string | string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function BrowserGate({ browser, fallback, children }: BrowserGateProps) {
  const browserInfo = useBrowserInfo();
  
  if (!browserInfo) {
    return <>{fallback}</>;
  }
  
  const targetBrowsers = Array.isArray(browser) ? browser : [browser];
  const isTargetBrowser = targetBrowsers.includes(browserInfo.name);
  
  if (isTargetBrowser) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}

/**
 * Component for device-specific rendering
 */
interface DeviceGateProps {
  device: 'mobile' | 'tablet' | 'desktop';
  fallback?: ReactNode;
  children: ReactNode;
}

export function DeviceGate({ device, fallback, children }: DeviceGateProps) {
  const browserInfo = useBrowserInfo();
  
  if (!browserInfo) {
    return <>{fallback}</>;
  }
  
  let isTargetDevice = false;
  switch (device) {
    case 'mobile':
      isTargetDevice = browserInfo.isMobile;
      break;
    case 'tablet':
      isTargetDevice = browserInfo.isTablet;
      break;
    case 'desktop':
      isTargetDevice = browserInfo.isDesktop;
      break;
  }
  
  if (isTargetDevice) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}

/**
 * Error boundary for browser compatibility issues
 */
interface BrowserCompatibilityErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class BrowserCompatibilityErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  BrowserCompatibilityErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): BrowserCompatibilityErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Browser compatibility error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="m3-error-boundary">
          <h2>Browser Compatibility Error</h2>
          <p>
            This application requires a modern browser with support for current web standards.
            Please update your browser or try a different one.
          </p>
          <details>
            <summary>Error Details</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}