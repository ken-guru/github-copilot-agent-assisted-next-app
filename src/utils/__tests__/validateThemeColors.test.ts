import { validateThemeColors } from '../colors';

// Mock getComputedStyle for testing
const mockGetComputedStyle = jest.fn();
Object.defineProperty(window, 'getComputedStyle', {
  value: mockGetComputedStyle,
});

describe('validateThemeColors', () => {
  beforeEach(() => {
    mockGetComputedStyle.mockClear();
  });

  describe('client-side validation', () => {
    it('should return true when all required CSS variables are present and non-empty', () => {
      const mockStyle = {
        getPropertyValue: jest.fn((variable: string) => {
          const values: Record<string, string> = {
            '--primary': '#007bff',
            '--secondary': '#6c757d',
            '--accent': '#28a745',
            '--background': '#ffffff',
            '--foreground': '#000000',
            '--border-color': '#dee2e6',
            '--error': '#dc3545',
            '--success': '#28a745'
          };
          return values[variable] || '';
        })
      };
      
      mockGetComputedStyle.mockReturnValue(mockStyle);
      
      expect(validateThemeColors()).toBe(true);
      expect(mockGetComputedStyle).toHaveBeenCalledWith(document.documentElement);
    });

    it('should return false when required CSS variables are missing', () => {
      const mockStyle = {
        getPropertyValue: jest.fn((variable: string) => {
          // Missing '--primary' and '--secondary'
          const values: Record<string, string> = {
            '--accent': '#28a745',
            '--background': '#ffffff',
            '--foreground': '#000000',
            '--border-color': '#dee2e6',
            '--error': '#dc3545',
            '--success': '#28a745'
          };
          return values[variable] || '';
        })
      };
      
      mockGetComputedStyle.mockReturnValue(mockStyle);
      
      expect(validateThemeColors()).toBe(false);
    });

    it('should return false when CSS variables are empty strings', () => {
      const mockStyle = {
        getPropertyValue: jest.fn((variable: string) => {
          const values: Record<string, string> = {
            '--primary': '',  // Empty
            '--secondary': '   ',  // Only whitespace
            '--accent': '#28a745',
            '--background': '#ffffff',
            '--foreground': '#000000',
            '--border-color': '#dee2e6',
            '--error': '#dc3545',
            '--success': '#28a745'
          };
          return values[variable] || '';
        })
      };
      
      mockGetComputedStyle.mockReturnValue(mockStyle);
      
      expect(validateThemeColors()).toBe(false);
    });

    it('should return false when some variables have only whitespace', () => {
      const mockStyle = {
        getPropertyValue: jest.fn((variable: string) => {
          const values: Record<string, string> = {
            '--primary': '#007bff',
            '--secondary': '\t\n  ',  // Only whitespace
            '--accent': '#28a745',
            '--background': '#ffffff',
            '--foreground': '#000000',
            '--border-color': '#dee2e6',
            '--error': '#dc3545',
            '--success': '#28a745'
          };
          return values[variable] || '';
        })
      };
      
      mockGetComputedStyle.mockReturnValue(mockStyle);
      
      expect(validateThemeColors()).toBe(false);
    });

    it('should check all required variables', () => {
      const mockStyle = {
        getPropertyValue: jest.fn(() => '#000000')
      };
      
      mockGetComputedStyle.mockReturnValue(mockStyle);
      
      validateThemeColors();
      
      const expectedVariables = [
        '--primary',
        '--secondary', 
        '--accent',
        '--background',
        '--foreground',
        '--border-color',
        '--error',
        '--success'
      ];
      
      expectedVariables.forEach(variable => {
        expect(mockStyle.getPropertyValue).toHaveBeenCalledWith(variable);
      });
    });
  });

  describe('server-side rendering', () => {
    const originalWindow = global.window;

    beforeEach(() => {
      // @ts-expect-error - Remove window for SSR simulation
      delete global.window;
    });

    afterEach(() => {
      global.window = originalWindow;
    });

    it('should return true in SSR environment when window is undefined', () => {
      expect(validateThemeColors()).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle getComputedStyle throwing an error gracefully', () => {
      mockGetComputedStyle.mockImplementation(() => {
        throw new Error('getComputedStyle failed');
      });
      
      // Should not throw and should handle the error gracefully
      expect(() => validateThemeColors()).toThrow();
    });

    it('should handle getPropertyValue returning null', () => {
      const mockStyle = {
        getPropertyValue: jest.fn(() => null)
      };
      
      mockGetComputedStyle.mockReturnValue(mockStyle);
      
      expect(validateThemeColors()).toBe(false);
    });
  });
});
