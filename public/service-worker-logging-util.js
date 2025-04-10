/**
 * Service Worker Logging Utility
 * 
 * Provides environment-aware logging functionality for the service worker
 */

/**
 * Determine if we're in a development environment
 * @returns {boolean} True if in development environment
 */
function isDevelopment() {
  // Check for explicit environment flag (if any build process sets it)
  if (self.ENVIRONMENT === 'development') return true;
  
  // Check common development hostnames
  const hostname = self.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
  
  // Check common development ports
  const port = self.location.port;
  if (port === '3000' || port === '8080' || port === '3001') return true;
  
  // Default to production behavior
  return false;
}

/**
 * Environment-aware logging function
 * @param {string} message - Message to log
 * @param {string} level - Log level (log, warn, error)
 */
function log(message, level = 'log') {
  // Always log errors and warnings regardless of environment
  const isImportant = level === 'error' || level === 'warn';
  
  // Only log in development or if it's an important message
  if (isDevelopment() || isImportant) {
    console[level](`[Service Worker] ${message}`);
  }
}

// Export the logging utilities
// This is using CommonJS-style exports for maximum compatibility
module.exports = { log, isDevelopment };
