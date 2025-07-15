/**
 * @jest-environment jsdom
 */

// Extract service worker strategy logic for testing
const determineStrategy = (pathname, isDev) => {
  // Check if this is an HTML request
  if (pathname.endsWith('.html')) {
    return 'network-first';
  }
  
  // Check file types for development-specific handling
  const isCssFile = pathname.endsWith('.css');
  const isJsFile = pathname.endsWith('.js') || pathname.endsWith('.jsx') || 
                  pathname.endsWith('.ts') || pathname.endsWith('.tsx');
  const isJsonFile = pathname.endsWith('.json');
  
  // In development mode, use network-first for CSS, JS, and JSON
  if (isDev && (isCssFile || isJsFile || isJsonFile)) {
    return 'network-first';
  }
  
  // Default to cache-first for other assets
  return 'cache-first';
};

describe('Service Worker Caching Strategies', () => {
  describe('Development Environment', () => {
    const isDev = true;
    
    test('HTML requests use network-first strategy', () => {
      expect(determineStrategy('/index.html', isDev)).toBe('network-first');
    });
    
    test('CSS files use network-first strategy', () => {
      expect(determineStrategy('/styles.css', isDev)).toBe('network-first');
    });
    
    test('JavaScript files use network-first strategy', () => {
      expect(determineStrategy('/script.js', isDev)).toBe('network-first');
      expect(determineStrategy('/component.jsx', isDev)).toBe('network-first');
      expect(determineStrategy('/utils.ts', isDev)).toBe('network-first');
      expect(determineStrategy('/component.tsx', isDev)).toBe('network-first');
    });
    
    test('JSON files use network-first strategy', () => {
      expect(determineStrategy('/data.json', isDev)).toBe('network-first');
    });
    
    test('Image files use cache-first strategy even in development', () => {
      expect(determineStrategy('/image.png', isDev)).toBe('cache-first');
      expect(determineStrategy('/logo.svg', isDev)).toBe('cache-first');
      expect(determineStrategy('/photo.jpg', isDev)).toBe('cache-first');
      expect(determineStrategy('/icon.gif', isDev)).toBe('cache-first');
    });
    
    test('Other file types use cache-first strategy', () => {
      expect(determineStrategy('/font.woff2', isDev)).toBe('cache-first');
      expect(determineStrategy('/document.pdf', isDev)).toBe('cache-first');
      expect(determineStrategy('/data.xml', isDev)).toBe('cache-first');
    });
  });
  
  describe('Production Environment', () => {
    const isDev = false;
    
    test('HTML requests use network-first strategy', () => {
      expect(determineStrategy('/index.html', isDev)).toBe('network-first');
    });
    
    test('CSS files use cache-first strategy', () => {
      expect(determineStrategy('/styles.css', isDev)).toBe('cache-first');
    });
    
    test('JavaScript files use cache-first strategy', () => {
      expect(determineStrategy('/script.js', isDev)).toBe('cache-first');
      expect(determineStrategy('/component.jsx', isDev)).toBe('cache-first');
      expect(determineStrategy('/utils.ts', isDev)).toBe('cache-first');
      expect(determineStrategy('/component.tsx', isDev)).toBe('cache-first');
    });
    
    test('JSON files use cache-first strategy', () => {
      expect(determineStrategy('/data.json', isDev)).toBe('cache-first');
    });
    
    test('Image files use cache-first strategy', () => {
      expect(determineStrategy('/image.png', isDev)).toBe('cache-first');
      expect(determineStrategy('/logo.svg', isDev)).toBe('cache-first');
      expect(determineStrategy('/photo.jpg', isDev)).toBe('cache-first');
      expect(determineStrategy('/icon.gif', isDev)).toBe('cache-first');
    });
    
    test('Other file types use cache-first strategy', () => {
      expect(determineStrategy('/font.woff2', isDev)).toBe('cache-first');
      expect(determineStrategy('/document.pdf', isDev)).toBe('cache-first');
      expect(determineStrategy('/data.xml', isDev)).toBe('cache-first');
    });
  });
});