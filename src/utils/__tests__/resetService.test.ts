import resetService from '../resetService';

describe('resetService', () => {
  beforeEach(() => {
    // Reset the module state between tests
    resetService['resetCallbacks'] = [];
    resetService['confirmFn'] = (message: string) => window.confirm(message);
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should register and execute callbacks on reset', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();
    
    resetService.registerResetCallback(mockCallback1);
    resetService.registerResetCallback(mockCallback2);
    
    resetService.reset({ skipConfirmation: true });
    
    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).toHaveBeenCalledTimes(1);
  });

  it('should return an unregister function that works', () => {
    const mockCallback = jest.fn();
    
    const unregister = resetService.registerResetCallback(mockCallback);
    resetService.reset({ skipConfirmation: true });
    
    expect(mockCallback).toHaveBeenCalledTimes(1);
    
    // Now unregister the callback
    unregister();
    resetService.reset({ skipConfirmation: true });
    
    // The callback should not have been called again
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should use custom confirmation function when provided', () => {
    const mockConfirmFn = jest.fn(() => true);
    resetService.setConfirmFunction(mockConfirmFn);
    
    resetService.reset();
    
    expect(mockConfirmFn).toHaveBeenCalledTimes(1);
    expect(window.confirm).not.toHaveBeenCalled();
  });

  it('should not execute callbacks if confirmation is false', () => {
    const mockCallback = jest.fn();
    resetService.registerResetCallback(mockCallback);
    
    // Set the confirm function to return false
    resetService.setConfirmFunction(() => false);
    
    const result = resetService.reset();
    
    expect(mockCallback).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should execute callbacks if skipConfirmation is true', () => {
    const mockCallback = jest.fn();
    resetService.registerResetCallback(mockCallback);
    
    // Set the confirm function to return false, but skipConfirmation is true
    resetService.setConfirmFunction(() => false);
    
    const result = resetService.reset({ skipConfirmation: true });
    
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });
  
  it('should use custom confirm message when provided', () => {
    const mockConfirmFn = jest.fn(() => true);
    resetService.setConfirmFunction(mockConfirmFn);
    
    const customMessage = 'Custom reset message';
    resetService.reset({ confirmMessage: customMessage });
    
    expect(mockConfirmFn).toHaveBeenCalledWith(customMessage);
  });
});