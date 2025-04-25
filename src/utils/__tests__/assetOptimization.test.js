import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  getOptimizedImageSrc,
  useResponsiveImage,
  useImagePreload,
  getImageSizeFromSrcSet,
  formatSrcSet,
  useOptimizedFonts
} from '../assetOptimization';

// Mock window.matchMedia
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  
  // Mock navigator.connection
  Object.defineProperty(window, 'navigator', {
    writable: true,
    value: {
      ...window.navigator,
      connection: {
        effectiveType: '4g',
        saveData: false
      }
    }
  });
});

describe('Asset Optimization Utilities', () => {
  describe('getOptimizedImageSrc', () => {
    test('returns webp format when supported', () => {
      // Mock image support check
      const originalCreateElement = document.createElement;
      document.createElement = jest.fn().mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          return {
            getContext: () => ({
              fillText: jest.fn()
            })
          };
        }
        return originalCreateElement(tagName);
      });
      
      // Mock webp support
      global.HTMLCanvasElement.prototype.toDataURL = jest.fn().mockReturnValue('data:image/webp;base64,123');
      
      const result = getOptimizedImageSrc('/images/photo.jpg', {
        quality: 80,
        format: 'auto'
      });
      
      expect(result).toBe('/images/photo.webp?q=80');
      
      // Restore original function
      document.createElement = originalCreateElement;
    });
    
    test('returns original format when webp not supported', () => {
      // Mock webp not supported
      global.HTMLCanvasElement.prototype.toDataURL = jest.fn().mockReturnValue('data:image/png;base64,123');
      
      const result = getOptimizedImageSrc('/images/photo.jpg', {
        quality: 80,
        format: 'auto'
      });
      
      expect(result).toBe('/images/photo.jpg?q=80');
    });
    
    test('respects format override', () => {
      const result = getOptimizedImageSrc('/images/photo.jpg', {
        quality: 90,
        format: 'jpg' // force jpg
      });
      
      expect(result).toBe('/images/photo.jpg?q=90');
    });
    
    test('adds resize parameters when dimensions provided', () => {
      const result = getOptimizedImageSrc('/images/photo.jpg', {
        width: 800,
        height: 600
      });
      
      expect(result).toBe('/images/photo.jpg?w=800&h=600');
    });
    
    test('includes data saver settings when enabled', () => {
      // Mock save-data mode
      Object.defineProperty(navigator, 'connection', {
        value: {
          saveData: true,
          effectiveType: '4g'
        },
        configurable: true
      });
      
      const result = getOptimizedImageSrc('/images/photo.jpg', {
        width: 800,
        height: 600,
        quality: 80
      });
      
      // Should use lower quality and resolution
      expect(result).toBe('/images/photo.jpg?w=600&h=450&q=65');
      
      // Reset mock
      Object.defineProperty(navigator, 'connection', {
        value: {
          saveData: false,
          effectiveType: '4g'
        },
        configurable: true
      });
    });
    
    test('adjusts quality based on connection speed', () => {
      // Mock slow connection
      Object.defineProperty(navigator, 'connection', {
        value: {
          saveData: false,
          effectiveType: '2g'
        },
        configurable: true
      });
      
      const result = getOptimizedImageSrc('/images/photo.jpg', {
        quality: 80
      });
      
      // Should use lower quality
      expect(result).toBe('/images/photo.jpg?q=60');
      
      // Reset mock
      Object.defineProperty(navigator, 'connection', {
        value: {
          saveData: false,
          effectiveType: '4g'
        },
        configurable: true
      });
    });
  });

  describe('useResponsiveImage', () => {
    test('returns appropriate image sizes based on viewport', () => {
      // Mock viewport size
      window.matchMedia.mockImplementation(query => {
        if (query === '(max-width: 480px)') return { matches: true };
        if (query === '(max-width: 768px)') return { matches: false };
        return { matches: false };
      });
      
      const TestComponent = () => {
        const { src, srcSet, sizes } = useResponsiveImage('/images/photo.jpg', {
          mobileSizes: [320, 480],
          tabletSizes: [640, 768],
          desktopSizes: [1024, 1280, 1920],
          defaultWidth: 800
        });
        
        return (
          <div>
            <span data-testid="src">{src}</span>
            <span data-testid="srcset">{srcSet}</span>
            <span data-testid="sizes">{sizes}</span>
          </div>
        );
      };
      
      render(<TestComponent />);
      
      // For mobile viewport
      expect(screen.getByTestId('src')).toHaveTextContent('/images/photo.jpg?w=480');
      expect(screen.getByTestId('srcset')).toContain('/images/photo.jpg?w=320');
      expect(screen.getByTestId('srcset')).toContain('/images/photo.jpg?w=480');
      expect(screen.getByTestId('sizes')).toContain('(max-width: 480px)');
    });
    
    test('includes webp format when supported', () => {
      // Mock webp support
      global.HTMLCanvasElement.prototype.toDataURL = jest.fn().mockReturnValue('data:image/webp;base64,123');
      
      const TestComponent = () => {
        const { srcSet } = useResponsiveImage('/images/photo.jpg', {
          mobileSizes: [320],
          defaultWidth: 320,
          formats: ['webp', 'jpg']
        });
        
        return <span data-testid="srcset">{srcSet}</span>;
      };
      
      render(<TestComponent />);
      
      // Should include webp format
      expect(screen.getByTestId('srcset')).toContain('/images/photo.webp');
      expect(screen.getByTestId('srcset')).toContain('/images/photo.jpg');
    });
  });
  
  describe('useImagePreload', () => {
    test('preloads images', () => {
      // Mock Image constructor
      global.Image = class {
        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }
      };
      
      const preloadSpy = jest.fn();
      
      const TestComponent = () => {
        const preload = useImagePreload();
        
        React.useEffect(() => {
          preload('/images/test.jpg').then(preloadSpy);
        }, [preload]);
        
        return <div>Test Component</div>;
      };
      
      render(<TestComponent />);
      
      // Wait for preload to complete
      return new Promise(resolve => setTimeout(resolve, 10)).then(() => {
        expect(preloadSpy).toHaveBeenCalled();
      });
    });
    
    test('handles preload failures', () => {
      // Mock Image constructor with error
      global.Image = class {
        constructor() {
          setTimeout(() => {
            if (this.onerror) this.onerror(new Error('Failed to load image'));
          }, 0);
        }
      };
      
      const onErrorSpy = jest.fn();
      
      const TestComponent = () => {
        const preload = useImagePreload();
        
        React.useEffect(() => {
          preload('/images/nonexistent.jpg').catch(onErrorSpy);
        }, [preload]);
        
        return <div>Test Component</div>;
      };
      
      render(<TestComponent />);
      
      // Wait for error to be triggered
      return new Promise(resolve => setTimeout(resolve, 10)).then(() => {
        expect(onErrorSpy).toHaveBeenCalled();
      });
    });
  });
  
  describe('getImageSizeFromSrcSet', () => {
    test('extracts correct image size for given width', () => {
      const srcSet = '/images/photo.jpg?w=320 320w, /images/photo.jpg?w=640 640w, /images/photo.jpg?w=1280 1280w';
      
      // Exact match
      expect(getImageSizeFromSrcSet(srcSet, 320)).toBe('/images/photo.jpg?w=320');
      expect(getImageSizeFromSrcSet(srcSet, 640)).toBe('/images/photo.jpg?w=640');
      expect(getImageSizeFromSrcSet(srcSet, 1280)).toBe('/images/photo.jpg?w=1280');
      
      // Closest match
      expect(getImageSizeFromSrcSet(srcSet, 400)).toBe('/images/photo.jpg?w=320');
      expect(getImageSizeFromSrcSet(srcSet, 1000)).toBe('/images/photo.jpg?w=640');
      expect(getImageSizeFromSrcSet(srcSet, 1500)).toBe('/images/photo.jpg?w=1280');
    });
    
    test('handles empty srcSet', () => {
      expect(getImageSizeFromSrcSet('', 400)).toBeNull();
    });
  });
  
  describe('formatSrcSet', () => {
    test('formats srcSet correctly', () => {
      const sources = [
        { src: '/images/photo.jpg?w=320', width: 320 },
        { src: '/images/photo.jpg?w=640', width: 640 }
      ];
      
      const result = formatSrcSet(sources);
      expect(result).toBe('/images/photo.jpg?w=320 320w, /images/photo.jpg?w=640 640w');
    });
    
    test('handles empty sources', () => {
      expect(formatSrcSet([])).toBe('');
    });
  });
  
  describe('useOptimizedFonts', () => {
    test('adds font optimization tags', () => {
      // Mock document head
      const originalAppendChild = document.head.appendChild;
      const appendChildMock = jest.fn();
      document.head.appendChild = appendChildMock;
      
      const fontConfig = {
        google: {
          families: ['Roboto:400,700', 'Open Sans:400']
        },
        preconnect: true,
        display: 'swap'
      };
      
      const TestComponent = () => {
        useOptimizedFonts(fontConfig);
        return <div>Test Component</div>;
      };
      
      render(<TestComponent />);
      
      // Should have added preconnect link
      expect(appendChildMock).toHaveBeenCalledWith(
        expect.objectContaining({
          rel: 'preconnect',
          href: expect.stringContaining('fonts.googleapis.com')
        })
      );
      
      // Should have added font stylesheet
      expect(appendChildMock).toHaveBeenCalledWith(
        expect.objectContaining({
          rel: 'stylesheet',
          href: expect.stringContaining('css2')
        })
      );
      
      // Restore original function
      document.head.appendChild = originalAppendChild;
    });
  });
});
