/**
 * Time formatting and manipulation utilities
 * 
 * @deprecated This file is maintained for backward compatibility.
 * Please import directly from the new modular structure:
 * - import { formatTime } from './time/timeFormatters'
 * - import { formatTimeFromMs } from './time/timeConversions'
 * - import { calculateDurationInSeconds } from './time/timeDurations'
 * - import type { TimeFormatOptions } from './time/types'
 */

// Import and re-export the specific functions to maintain backward compatibility
import { formatTime, formatTimeMMSS } from './time/timeFormatters';
import { formatTimeFromMs } from './time/timeConversions';
import { calculateDurationInSeconds } from './time/timeDurations';
import { TimeFormatOptions } from './time/types';

// Named exports to match the original API
export {
  formatTime,
  formatTimeMMSS,
  formatTimeFromMs,
  calculateDurationInSeconds,
  TimeFormatOptions
};

// Re-export everything else from the time module
export * from './time';