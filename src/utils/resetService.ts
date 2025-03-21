/**
 * Reset service for centralized application state reset
 * 
 * This service provides a test-friendly way to reset the application
 * without relying on window.location.reload().
 */

export type ResetCallback = () => void;
export type ConfirmCallback = (message: string) => boolean;

export interface ResetOptions {
  confirmMessage?: string;
  skipConfirmation?: boolean;
}

class ResetService {
  private resetCallbacks: ResetCallback[] = [];
  private confirmFn: ConfirmCallback = (message) => window.confirm(message);
  private defaultOptions: ResetOptions = {
    confirmMessage: 'Are you sure you want to reset the application? All progress will be lost.',
    skipConfirmation: false,
  };

  /**
   * Register a callback to be called when the application is reset
   * @param callback Function to be called during reset
   * @returns Function to unregister the callback
   */
  registerResetCallback(callback: ResetCallback): () => void {
    this.resetCallbacks.push(callback);
    return () => {
      this.resetCallbacks = this.resetCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Set a custom confirmation function for testing
   * @param confirmFn Function to use for confirmation
   */
  setConfirmFunction(confirmFn: ConfirmCallback): void {
    this.confirmFn = confirmFn;
  }

  /**
   * Reset the application state by calling all registered callbacks
   * @param options Reset options
   * @returns Boolean indicating whether reset was performed
   */
  reset(options?: ResetOptions): boolean {
    const { confirmMessage, skipConfirmation } = { ...this.defaultOptions, ...options };
    
    if (!skipConfirmation && !this.confirmFn(confirmMessage || this.defaultOptions.confirmMessage!)) {
      return false;
    }

    // Execute all registered reset callbacks
    this.resetCallbacks.forEach(callback => callback());
    return true;
  }
}

// Create a singleton instance
const resetService = new ResetService();

export default resetService;