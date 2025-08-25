/**
 * Compatibility shim – prefer './sw-cache-strategies.js'.
 *
 * This file preserves the legacy module path `public/caching-strategies` used by
 * older code/tests while delegating to the canonical implementation in
 * `public/sw-cache-strategies.js`. It also exports a minimal `CACHE_NAMES`
 * constant for modules (like `sw-lifecycle.js`) that referenced it previously.
 */

'use strict';

// Canonical implementations of strategies and helpers
const strategies = require('./sw-cache-strategies.js');

// Legacy cache name constants kept for backward compatibility
const CACHE_NAMES = {
  PRECACHE: 'v1-precache',
  RUNTIME: 'v1-runtime',
};

module.exports = {
  // Back-compat constants
  CACHE_NAMES,
  // Re-export all canonical helpers and strategies
  ...strategies,
};
