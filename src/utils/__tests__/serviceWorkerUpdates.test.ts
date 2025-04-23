import { checkForUpdates, handleRegistration } from '../serviceWorkerUpdates';

describe('serviceWorkerUpdates', () => {
  describe('handleRegistration', () => {
    it('should call onSuccess when worker is not waiting', () => {
      const mockRegistration = {
        waiting: null,
        installing: null,
      };
      const onSuccess = jest.fn();
      const onUpdate = jest.fn();

      handleRegistration(mockRegistration, { onSuccess, onUpdate });
      expect(onSuccess).toHaveBeenCalled();
      expect(onUpdate).not.toHaveBeenCalled();
    });

    it('should call onUpdate when worker is waiting', () => {
      const mockRegistration = {
        waiting: {},
        installing: null,
      };
      const onSuccess = jest.fn();
      const onUpdate = jest.fn();

      handleRegistration(mockRegistration, { onSuccess, onUpdate });
      expect(onUpdate).toHaveBeenCalledWith(mockRegistration);
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('should listen for install changes when worker is installing', () => {
      const mockInstallingWorker = {
        addEventListener: jest.fn(),
        state: 'installing',
      };
      const mockRegistration = {
        waiting: null,
        installing: mockInstallingWorker,
      };
      const onSuccess = jest.fn();
      const onUpdate = jest.fn();

      handleRegistration(mockRegistration, { onSuccess, onUpdate });
      
      expect(mockInstallingWorker.addEventListener).toHaveBeenCalledWith(
        'statechange', 
        expect.any(Function)
      );
    });
  });

  describe('checkForUpdates', () => {
    it('should trigger update check on registration', async () => {
      const mockRegistration = {
        update: jest.fn().mockResolvedValue(undefined),
      };
      
      await checkForUpdates(mockRegistration);
      expect(mockRegistration.update).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const mockRegistration = {
        update: jest.fn().mockRejectedValue(new Error('Update failed')),
      };
      
      // Should not throw error
      await expect(checkForUpdates(mockRegistration)).resolves.not.toThrow();
    });
  });
});
