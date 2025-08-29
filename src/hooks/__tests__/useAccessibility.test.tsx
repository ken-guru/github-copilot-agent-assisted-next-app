/**
 * Tests for accessibility React hooks
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import {
  useAccessibility,
  useLiveRegion,
  useFocusTrap,
  useReducedMotion,
} from '../useAccessibility';

// Mock the accessibility utils
jest.mock('../../utils/accessibility-utils', () => ({
  focusManager: {
    setFocus: jest.fn(),
    restoreFocus: jest.fn(),
    trapFocus: jest.fn(),
    releaseFocusTrap: jest.fn(),
  },
  screenReader: {
    announce: jest.fn(),
  },
  prefersReducedMotion: jest.fn().mockReturnValue(false),
  KeyboardNavigation: jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
  })),
}));

jest.mock('../../utils/material3-accessibility', () => ({
  Material3AriaEnhancements: {
    enhanceButton: jest.fn(),
    enhanceFormField: jest.fn(),
    createLiveRegion: jest.fn().mockReturnValue(document.createElement('div')),
  },
  material3ColorAccessibility: {
    validateColorTokens: jest.fn().mockReturnValue({}),
  },
}));

describe('useAccessibility', () => {
  beforeEach(() => {
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('should provide accessibility state', () => {
    const { result } = renderHook(() => useAccessibility());

    expect(result.current.accessibilityState).toEqual({
      prefersReducedMotion: false,
      prefersHighContrast: false,
      keyboardNavigation: false,
      screenReaderActive: false,
    });
  });

  it('should provide announce function', () => {
    const { result } = renderHook(() => useAccessibility());
    const mockAnnounce = require('../../utils/accessibility-utils').screenReader.announce;

    act(() => {
      result.current.announce('Test message');
    });

    expect(mockAnnounce).toHaveBeenCalledWith('Test message', 'polite');
  });

  it('should provide focus management functions', () => {
    const { result } = renderHook(() => useAccessibility());
    const mockFocusManager = require('../../utils/accessibility-utils').focusManager;

    const element = document.createElement('button');

    act(() => {
      result.current.setFocus(element);
    });

    expect(mockFocusManager.setFocus).toHaveBeenCalledWith(element, undefined);

    act(() => {
      result.current.restoreFocus();
    });

    expect(mockFocusManager.restoreFocus).toHaveBeenCalled();
  });

  it('should detect keyboard navigation', () => {
    const { result } = renderHook(() => useAccessibility());

    // Simulate tab key press
    act(() => {
      fireEvent.keyDown(document, { key: 'Tab' });
    });

    expect(result.current.accessibilityState.keyboardNavigation).toBe(true);

    // Simulate mouse down
    act(() => {
      fireEvent.mouseDown(document);
    });

    expect(result.current.accessibilityState.keyboardNavigation).toBe(false);
  });

  it('should respect options', () => {
    const { result } = renderHook(() => 
      useAccessibility({ 
        announceChanges: false,
        manageFocus: false,
      })
    );

    const mockAnnounce = require('../../utils/accessibility-utils').screenReader.announce;
    const mockFocusManager = require('../../utils/accessibility-utils').focusManager;

    act(() => {
      result.current.announce('Test message');
    });

    expect(mockAnnounce).not.toHaveBeenCalled();

    const element = document.createElement('button');
    act(() => {
      result.current.setFocus(element);
    });

    expect(mockFocusManager.setFocus).not.toHaveBeenCalled();
  });

  it('should provide ARIA enhancement functions', () => {
    const { result } = renderHook(() => useAccessibility());
    const mockEnhanceButton = require('../../utils/material3-accessibility').Material3AriaEnhancements.enhanceButton;

    const button = document.createElement('button');
    const ariaOptions = { label: 'Test button' };

    act(() => {
      result.current.enhanceButton(button, ariaOptions);
    });

    expect(mockEnhanceButton).toHaveBeenCalledWith(button, ariaOptions);
  });
});

describe('useLiveRegion', () => {
  it('should create live region and provide announce function', () => {
    const { result } = renderHook(() => useLiveRegion('test-region', 'assertive'));
    const mockCreateLiveRegion = require('../../utils/material3-accessibility').Material3AriaEnhancements.createLiveRegion;

    expect(mockCreateLiveRegion).toHaveBeenCalledWith('test-region', 'assertive');

    // Should provide announce function
    expect(typeof result.current.announce).toBe('function');
  });

  it('should announce messages to live region', async () => {
    const mockElement = document.createElement('div');
    const mockCreateLiveRegion = require('../../utils/material3-accessibility').Material3AriaEnhancements.createLiveRegion;
    mockCreateLiveRegion.mockReturnValue(mockElement);

    const { result } = renderHook(() => useLiveRegion('test-region'));

    act(() => {
      result.current.announce('Test announcement');
    });

    expect(mockElement.textContent).toBe('Test announcement');

    // Should clear after timeout
    await waitFor(() => {
      expect(mockElement.textContent).toBe('');
    }, { timeout: 1100 });
  });
});

describe('useFocusTrap', () => {
  it('should trap focus when active', () => {
    const mockFocusManager = require('../../utils/accessibility-utils').focusManager;

    const TestComponent = ({ isActive }: { isActive: boolean }) => {
      const containerRef = useFocusTrap(isActive);
      
      React.useEffect(() => {
        if (containerRef.current) {
          // Container is set
        }
      }, [containerRef]);
      
      return <div ref={containerRef} data-testid="focus-trap-container" />;
    };

    const { rerender } = render(<TestComponent isActive={false} />);
    
    // Re-render with active state
    rerender(<TestComponent isActive={true} />);

    // The focus manager should be called
    expect(mockFocusManager.trapFocus).toHaveBeenCalled();
  });

  it('should release focus trap when inactive', () => {
    const mockFocusManager = require('../../utils/accessibility-utils').focusManager;

    const TestComponent = ({ isActive }: { isActive: boolean }) => {
      const containerRef = useFocusTrap(isActive);
      return <div ref={containerRef} data-testid="focus-trap-container" />;
    };

    const { unmount } = render(<TestComponent isActive={true} />);
    
    // Unmount should trigger cleanup
    unmount();

    expect(mockFocusManager.releaseFocusTrap).toHaveBeenCalled();
  });
});

describe('useReducedMotion', () => {
  it('should detect reduced motion preference', () => {
    // Mock prefersReducedMotion to return true
    const mockPrefersReducedMotion = require('../../utils/accessibility-utils').prefersReducedMotion;
    mockPrefersReducedMotion.mockReturnValue(true);

    const mockMatchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    const { result } = renderHook(() => useReducedMotion());

    // The hook should detect the reduced motion preference
    expect(result.current).toBe(true);
  });

  it('should update when preference changes', () => {
    let mediaQueryCallback: ((e: MediaQueryListEvent) => void) | null = null;

    const mockMatchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      addEventListener: jest.fn().mockImplementation((event, callback) => {
        if (event === 'change') {
          mediaQueryCallback = callback;
        }
      }),
      removeEventListener: jest.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);

    // Simulate media query change
    if (mediaQueryCallback) {
      act(() => {
        mediaQueryCallback({ matches: true } as MediaQueryListEvent);
      });
    }

    expect(result.current).toBe(true);
  });
});

// Integration test component
const TestComponent: React.FC = () => {
  const {
    announce,
    setFocus,
    enhanceButton,
    accessibilityState,
  } = useAccessibility();

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (buttonRef.current) {
      enhanceButton(buttonRef.current, { label: 'Enhanced button' });
    }
  }, [enhanceButton]);

  return (
    <div>
      <button
        ref={buttonRef}
        onClick={() => {
          announce('Button clicked');
          setFocus(buttonRef.current);
        }}
      >
        Test Button
      </button>
      <div data-testid="accessibility-state">
        {JSON.stringify(accessibilityState)}
      </div>
    </div>
  );
};

describe('useAccessibility integration', () => {
  it('should work in component context', () => {
    render(<TestComponent />);

    const button = screen.getByRole('button', { name: /test button/i });
    const stateDisplay = screen.getByTestId('accessibility-state');

    expect(button).toBeInTheDocument();
    expect(stateDisplay).toBeInTheDocument();

    // Click button to trigger accessibility functions
    fireEvent.click(button);

    // Should have called accessibility functions
    const mockAnnounce = require('../../utils/accessibility-utils').screenReader.announce;
    const mockSetFocus = require('../../utils/accessibility-utils').focusManager.setFocus;

    expect(mockAnnounce).toHaveBeenCalledWith('Button clicked', 'polite');
    expect(mockSetFocus).toHaveBeenCalled();
  });
});