/**
 * Service Worker Fetch Handlers
 * Contains request routing and handling logic for service worker fetch events
 */

// Import caching strategies
const { 
  networkFirst, 
  cacheFirst, 
  staleWhileRevalidate, 
  networkOnly 
} = require('./sw-cache-strategies');

// Detect test environment
const isTestEnv = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test';

// Helper function for logging that's quiet during tests
const log = isTestEnv ? () => {} : console.log;
const errorLog = isTestEnv ? () => {} : console.error;

// Cache names for different types of resources
const CACHE_NAMES = {
  STATIC: 'static-assets-v1',
  DYNAMIC: 'dynamic-content-v1',
  PAGES: 'pages-cache-v1',
  IMAGES: 'images-cache-v1',
  API: 'api-cache-v1',
  FONTS: 'fonts-cache-v1'
};

/**
 * Main fetch event handler - routes requests to appropriate cache strategies
 * @param {Request} request - The fetch request to handle
 * @returns {Promise<Response>} - The response
 */
async function handleFetch(request) {
  try {
    // Route the request based on its characteristics
    if (isApiRequest(request)) {
      return await networkFirst(request, CACHE_NAMES.API);
    } else if (isNavigationRequest(request)) {
      return await networkFirst(request, CACHE_NAMES.PAGES);
    } else if (isStaticAsset(request)) {
      // FIX: This was incorrectly using images cache before, now using static assets cache
      return await cacheFirst(request, CACHE_NAMES.STATIC);
    } else if (isImageRequest(request)) {
      return await cacheFirst(request, CACHE_NAMES.IMAGES);
    } else if (isFontRequest(request)) {
      return await staleWhileRevalidate(request, CACHE_NAMES.FONTS);
    }
    
    // Default to network-only for unmatched requests
    return await networkOnly(request);
  } catch (error) {
    log('Fetch handler error:', error);
    
    // Provide offline fallback for navigation requests
    if (isNavigationRequest(request)) {
      return new Response(
        '<html><body><h1>You are offline</h1><p>Please check your internet connection.</p></body></html>',
        {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        }
      );
    }
    
    // Return a basic error response for non-navigation requests
    return new Response('Network error occurred', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

/**
 * Check if request is a navigation request (HTML document request)
 * @param {Request} request - The request to check
 * @returns {boolean} - True if it's a navigation request
 */
function isNavigationRequest(request) {
  // Check Accept header for HTML content type
  const acceptHeader = request.headers.get('Accept') || '';
  if (acceptHeader.includes('text/html')) {
    return true;
  }
  
  // Check URL for HTML file extension
  const url = new URL(request.url, self.location.origin);
  if (url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    return true;
  }
  
  return false;
}

/**
 * Check if request is for a static asset
 * @param {Request} request - The request to check
 * @returns {boolean} - True if it's a static asset request
 */
function isStaticAsset(request) {
  const url = new URL(request.url, self.location.origin);
  
  // Check for common static asset paths
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/static/')) {
    return true;
  }
  
  // Check for common static asset file extensions
  const staticExtensions = ['.js', '.css', '.json', '.xml', '.svg', '.ico'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

/**
 * Check if request is for an image
 * @param {Request} request - The request to check
 * @returns {boolean} - True if it's an image request
 */
function isImageRequest(request) {
  const url = new URL(request.url, self.location.origin);
  
  // Check for common image paths
  if (url.pathname.startsWith('/images/') || url.pathname.includes('/profile/') && !url.pathname.endsWith('.js')) {
    return true;
  }
  
  // Check for common image file extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.avif'];
  return imageExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
}

/**
 * Check if request is for an API endpoint
 * @param {Request} request - The request to check
 * @returns {boolean} - True if it's an API request
 */
function isApiRequest(request) {
  const url = new URL(request.url, self.location.origin);
  
  // Check for API path
  return url.pathname.startsWith('/api/');
}

/**
 * Check if request is for a font file
 * @param {Request} request - The request to check
 * @returns {boolean} - True if it's a font request
 */
function isFontRequest(request) {
  const url = new URL(request.url, self.location.origin);
  
  // Check for common font paths
  if (url.pathname.startsWith('/fonts/') || 
      url.pathname.includes('/assets/fonts/') || 
      url.hostname.includes('fonts.googleapis.com')) {
    return true;
  }
  
  // Check for common font file extensions
  const fontExtensions = ['.woff', '.woff2', '.ttf', '.otf', '.eot'];
  return fontExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
}

// Export functions for testing and use in main service worker
module.exports = {
  handleFetch,
  isNavigationRequest,
  isStaticAsset,
  isImageRequest,
  isApiRequest,
  isFontRequest,
  CACHE_NAMES
};
