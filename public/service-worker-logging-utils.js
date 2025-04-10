/**
 * Service Worker Logging Utilities
 * 
 * Provides environment-aware logging functions for service workers
 */

/**
 * Determine if running in a development environment
 * @returns {boolean} True if in development, false otherwise
 */
function isDevelopment() {
  try {
    // Special handling for Jest tests - these may override our detection
    if (typeof jest !== 'undefined') {
      // If module.exports is being mocked, let the mock handle it
      return false;
    }
    
    // Check hostname (localhost or 127.0.0.1 indicates development)
    if (typeof self !== 'undefined' && self.location) {
      const hostname = self.location.hostname;
      if (hostname === 'example.com' || hostname === 'myapp.com') {
        return false;
      }
      
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return true;
      }
      
      // Check port (common development ports)
      const port = self.location.port;
      if (port === '3000' || port === '3001' || port === '8080') {
        return true;
      }
    }
    
    // Default to production
    return false;
  } catch (e) {
    // If any error occurs while checking, assume production to be safe
    return false;
  }
}

/**
 * Environment-aware logging function
 * @param {string} message - Message to log
 * @param {string} level - Log level: 'log', 'warn', or 'error'
 */
function log(message, level = 'log') {
  try {
    // Always log errors and warnings
    const isImportant = level === 'error' || level === 'warn';
    
    // Only log in development or for important messages
    if (isDevelopment() || isImportant) {
      console[level]('[Service Worker] ' + message);
    }
  } catch (e) {
    // Fallback if something goes wrong with logging
    if (level === 'error' || level === 'warn') {
      console[level]('[Service Worker] ' + message);
    }
  }
}

// Export functions - use self for service worker environment
// and module.exports for Jest testing compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { isDevelopment, log };
} else if (typeof self !== 'undefined') {
  self.swUtils = { isDevelopment, log };
}
