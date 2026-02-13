/**
 * Haptic Feedback Utility
 * Provides cross-platform haptic/vibration feedback for touch interactions
 */

/**
 * Check if haptic feedback is supported
 */
export const isHapticSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 
         'vibrate' in navigator && 
         typeof navigator.vibrate === 'function';
};

/**
 * Haptic Feedback patterns for different interactions
 */
export class HapticFeedback {
  /**
   * Light haptic feedback for subtle interactions (button taps, selections)
   * Duration: 10ms
   */
  static light(): void {
    if (isHapticSupported()) {
      navigator.vibrate(10);
    }
  }

  /**
   * Medium haptic feedback for standard interactions
   * Duration: 20ms
   */
  static medium(): void {
    if (isHapticSupported()) {
      navigator.vibrate(20);
    }
  }

  /**
   * Success haptic feedback - double pulse pattern
   * Pattern: 10ms vibrate, 50ms pause, 10ms vibrate
   */
  static success(): void {
    if (isHapticSupported()) {
      navigator.vibrate([10, 50, 10]);
    }
  }

  /**
   * Error haptic feedback - triple pulse pattern
   * Pattern: 20ms vibrate, 100ms pause, 20ms vibrate
   */
  static error(): void {
    if (isHapticSupported()) {
      navigator.vibrate([20, 100, 20]);
    }
  }

  /**
   * Warning haptic feedback - long single pulse
   * Duration: 30ms
   */
  static warning(): void {
    if (isHapticSupported()) {
      navigator.vibrate(30);
    }
  }

  /**
   * Custom haptic pattern
   * @param pattern - Array of vibration durations in milliseconds [vibrate, pause, vibrate, pause, ...]
   */
  static custom(pattern: number[]): void {
    if (isHapticSupported()) {
      navigator.vibrate(pattern);
    }
  }

  /**
   * Stop any ongoing haptic feedback
   */
  static stop(): void {
    if (isHapticSupported()) {
      navigator.vibrate(0);
    }
  }
}
