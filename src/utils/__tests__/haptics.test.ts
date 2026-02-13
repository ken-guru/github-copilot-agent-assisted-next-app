import { HapticFeedback, isHapticSupported } from '../haptics';

describe('Haptics Utility', () => {
  let mockVibrate: jest.Mock;

  beforeEach(() => {
    mockVibrate = jest.fn();
    Object.defineProperty(navigator, 'vibrate', {
      writable: true,
      value: mockVibrate
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isHapticSupported', () => {
    test('returns true when vibrate is available', () => {
      expect(isHapticSupported()).toBe(true);
    });
  });

  describe('HapticFeedback', () => {
    test('light feedback vibrates for 10ms', () => {
      HapticFeedback.light();
      expect(mockVibrate).toHaveBeenCalledWith(10);
    });

    test('medium feedback vibrates for 20ms', () => {
      HapticFeedback.medium();
      expect(mockVibrate).toHaveBeenCalledWith(20);
    });

    test('success feedback uses double pulse pattern', () => {
      HapticFeedback.success();
      expect(mockVibrate).toHaveBeenCalledWith([10, 50, 10]);
    });

    test('error feedback uses triple pulse pattern', () => {
      HapticFeedback.error();
      expect(mockVibrate).toHaveBeenCalledWith([20, 100, 20]);
    });

    test('warning feedback vibrates for 30ms', () => {
      HapticFeedback.warning();
      expect(mockVibrate).toHaveBeenCalledWith(30);
    });

    test('custom feedback uses provided pattern', () => {
      const customPattern = [50, 100, 50, 100, 50];
      HapticFeedback.custom(customPattern);
      expect(mockVibrate).toHaveBeenCalledWith(customPattern);
    });

    test('stop cancels vibration', () => {
      HapticFeedback.stop();
      expect(mockVibrate).toHaveBeenCalledWith(0);
    });
  });

  describe('when vibrate is not supported', () => {
    beforeEach(() => {
      // Replace vibrate with undefined instead of deleting
      Object.defineProperty(navigator, 'vibrate', {
        writable: true,
        value: undefined
      });
    });

    test('isHapticSupported returns false', () => {
      expect(isHapticSupported()).toBe(false);
    });

    test('haptic methods do not throw errors', () => {
      expect(() => HapticFeedback.light()).not.toThrow();
      expect(() => HapticFeedback.success()).not.toThrow();
      expect(() => HapticFeedback.error()).not.toThrow();
    });
  });
});
