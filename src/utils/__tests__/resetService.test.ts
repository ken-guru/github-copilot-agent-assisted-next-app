import resetService from '../resetService';

describe('resetService', () => {
  beforeEach(() => {
    // Reset the module state between tests
    resetService['resetCallbacks'] = [];
    resetService.setDialogCallback(null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should register and execute callbacks on reset', async () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();
    
    resetService.registerResetCallback(mockCallback1);
    resetService.registerResetCallback(mockCallback2);
    
    // Mock the dialog function to immediately return true (confirmed)
    resetService.setDialogCallback(() => Promise.resolve(true));
    
    const result = await resetService.reset({ skipConfirmation: true });
    
    expect(result).toBe(true);
    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).toHaveBeenCalledTimes(1);
  });

  it('should return an unregister function that works', async () => {
    const mockCallback = jest.fn();
    
    const unregister = resetService.registerResetCallback(mockCallback);
    
    // Mock the dialog function to immediately return true (confirmed)
    resetService.setDialogCallback(() => Promise.resolve(true));
    
    await resetService.reset({ skipConfirmation: true });
    
    expect(mockCallback).toHaveBeenCalledTimes(1);
    
    // Now unregister the callback
    unregister();
    await resetService.reset({ skipConfirmation: true });
    
    // The callback should not have been called again
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should use dialog callback when provided', async () => {
    const mockDialogCallback = jest.fn().mockImplementation(() => Promise.resolve(true));
    resetService.setDialogCallback(mockDialogCallback);
    
    const mockResetCallback = jest.fn();
    resetService.registerResetCallback(mockResetCallback);
    
    await resetService.reset({ confirmMessage: 'Custom message' });
    
    expect(mockDialogCallback).toHaveBeenCalledTimes(1);
    expect(mockDialogCallback).toHaveBeenCalledWith('Custom message');
    expect(mockResetCallback).toHaveBeenCalled();
  });

  it('should not execute callbacks if dialog returns false', async () => {
    const mockCallback = jest.fn();
    resetService.registerResetCallback(mockCallback);
    
    // Set the dialog callback to return false (cancelled)
    resetService.setDialogCallback(() => Promise.resolve(false));
    
    const result = await resetService.reset();
    
    expect(mockCallback).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should execute callbacks if skipConfirmation is true', async () => {
    const mockCallback = jest.fn();
    resetService.registerResetCallback(mockCallback);
    
    // Set the dialog callback to return false, but skipConfirmation is true
    resetService.setDialogCallback(() => Promise.resolve(false));
    
    const result = await resetService.reset({ skipConfirmation: true });
    
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });
  
  it('should use custom confirm message in dialog callback', async () => {
    const mockDialogCallback = jest.fn().mockImplementation(() => Promise.resolve(true));
    resetService.setDialogCallback(mockDialogCallback);
    
    const customMessage = 'Custom reset message';
    await resetService.reset({ confirmMessage: customMessage });
    
    expect(mockDialogCallback).toHaveBeenCalledWith(customMessage);
  });

  it('should use legacy window.confirm if no dialog callback is set', async () => {
    // Mock window.confirm to always return true
    const originalConfirm = window.confirm;
    window.confirm = jest.fn().mockReturnValue(true);

    const mockCallback = jest.fn();
    resetService.registerResetCallback(mockCallback);
    
    // No dialog callback set, should fall back to window.confirm
    await resetService.reset();
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockCallback).toHaveBeenCalled();

    // Restore original confirm
    window.confirm = originalConfirm;
  });
});