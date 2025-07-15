/**
 * Reset service for centralized application state reset
 * 
 * This service provides a test-friendly way to reset the application
 * without relying on window.location.reload().
 */

export type ResetCallback = () => void;
export type DialogCallback = (message: string) => Promise<boolean>;

export interface ResetOptions {
  confirmMessage?: string;
  skipConfirmation?: boolean;
}

class ResetService {
  private resetCallbacks: ResetCallback[] = [];
  private dialogCallback: DialogCallback | null = null;
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
   * Set a dialog callback function for custom dialog confirmation
   * @param dialogCallback Function that shows a dialog and returns a promise resolving to boolean
   */
  setDialogCallback(dialogCallback: DialogCallback | null): void {
    this.dialogCallback = dialogCallback;
  }

  /**
   * Reset the application state by calling all registered callbacks
   * @param options Reset options
   * @returns Promise resolving to boolean indicating whether reset was performed
   */
  async reset(options?: ResetOptions): Promise<boolean> {
    const { confirmMessage, skipConfirmation } = { ...this.defaultOptions, ...options };
    
    // Ask for confirmation if needed
    if (!skipConfirmation) {
      const message = confirmMessage || 'Are you sure you want to reset the application?';
      const shouldReset = await this.showConfirmation(message);
      if (!shouldReset) {
        return false;
      }
    }
    
    // Call all registered reset callbacks
    for (const callback of this.resetCallbacks) {
      try {
        callback();
      } catch (error) {
        console.error("Error in reset callback:", error);
      }
    }
    
    return true;
  }
  
  /**
   * Show confirmation dialog
   * @param message Message to show in the dialog
   * @returns Promise resolving to boolean indicating user's choice
   */
  private async showConfirmation(message: string): Promise<boolean> {
    if (this.dialogCallback) {
      return this.dialogCallback(message);
    }
    
    // Default to browser confirm dialog if no custom dialog is provided
    return Promise.resolve(window.confirm(message));
  }
}

// Export singleton instance for app-wide use
const resetService = new ResetService();
export default resetService;
