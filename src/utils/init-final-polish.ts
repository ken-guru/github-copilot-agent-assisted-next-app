/**
 * Initialize Final Polish optimizations
 * 
 * This file should be imported in the main layout to automatically
 * apply final polish optimizations when the app loads.
 */

import { initializeFinalPolish } from './final-polish';

// Auto-initialize final polish optimizations
if (typeof window !== 'undefined') {
  initializeFinalPolish();
}

export { initializeFinalPolish };