import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import DisplayToggle from '../../components/ui/DisplayToggle';
import { DisplaySettingsProvider } from '../../components/contexts/DisplaySettingsContext';

// Mock the useWakeLock hook
jest.mock('../../hooks/useWakeLock', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isSupported: true,
    isActive: false,
    request: jest.fn(),
    release: jest.fn(),
  })),
}));

describe('DisplayToggle', () => {
  // Clean up after each test
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  // Test for safe server-side rendering
  it('renders consistently on server and client', () => {
    // Save original window
    const originalWindow = global.window;
    
    // Simulate server environment (no window)
    // @ts-ignore - Deliberately setting window to undefined to simulate server environment
    global.window = undefined;
    
    const { container: serverContainer } = render(
      <DisplaySettingsProvider>
        <DisplayToggle />
      </DisplaySettingsProvider>
    );
    
    const serverHTML = serverContainer.innerHTML;
    
    // Restore window for client rendering
    global.window = originalWindow;
    
    const { container: clientContainer } = render(
      <DisplaySettingsProvider>
        <DisplayToggle />
      </DisplaySettingsProvider>
    );
    
    const clientHTML = clientContainer.innerHTML;
    
    // The HTML structure should match to avoid hydration mismatches
    expect(serverHTML).toEqual(clientHTML);
  });
  
  it('renders with default state', () => {
    render(
      <DisplaySettingsProvider>
        <DisplayToggle />
      </DisplaySettingsProvider>
    );
    
    expect(screen.getByRole('switch')).toBeInTheDocument();
    expect(screen.getByRole('switch')).not.toBeChecked();
    
    // Use a more specific selector to avoid ambiguity with multiple text matches
    expect(screen.getByText(/Keep Display On/i, { selector: '.text-sm' })).toBeInTheDocument();
  });
  
  it('toggles when clicked', () => {
    render(
      <DisplaySettingsProvider>
        <DisplayToggle />
      </DisplaySettingsProvider>
    );
    
    const toggle = screen.getByRole('switch');
    expect(toggle).not.toBeChecked();
    
    fireEvent.click(toggle);
    expect(toggle).toBeChecked();
    
    fireEvent.click(toggle);
    expect(toggle).not.toBeChecked();
  });
  
  it('shows unsupported message only on client when Wake Lock API is not supported', () => {
    // Update the mock to indicate no support for client-side test
    const useWakeLockMock = require('../../hooks/useWakeLock').default;
    useWakeLockMock.mockImplementationOnce(() => ({
      isSupported: false,
      isActive: false,
      request: jest.fn(),
      release: jest.fn(),
    }));
    
    // Save original window
    const originalWindow = global.window;
    
    // First render on client
    const { queryByText } = render(
      <DisplaySettingsProvider>
        <DisplayToggle />
      </DisplaySettingsProvider>
    );
    
    // Should show the unsupported message on client
    expect(queryByText(/not supported/i)).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeDisabled();
    
    cleanup();
    
    // Now test server-side rendering
    
    // 1. Set up environment for server rendering
    // @ts-ignore - Deliberately setting window to undefined to simulate server environment
    global.window = undefined;
    
    // 2. Create a new mock for the server-side test
    // This is important - we need to reset the mock for the new render cycle
    jest.resetModules(); // Clear module cache
    jest.mock('../../hooks/useWakeLock', () => ({
      __esModule: true,
      // For server-side rendering test, mock this differently
      default: () => ({
        isSupported: true, // This won't even matter on the server side
        isActive: false,
        request: jest.fn(),
        release: jest.fn(),
      }),
    }), { virtual: true });
    
    // 3. Create a self-checking wrapper component
    const ServerRenderedComponent = () => {
      // Double verify we're in server environment
      if (typeof window !== 'undefined') {
        throw new Error('Not in server environment as expected');
      }
      
      return (
        <DisplaySettingsProvider>
          <DisplayToggle />
        </DisplaySettingsProvider>
      );
    };
    
    // 4. Render in simulated server environment
    const { queryByText: queryServerText } = render(<ServerRenderedComponent />);
    
    // 5. Verify "not supported" message isn't displayed on server
    const unsupportedMessage = queryServerText(/not supported/i);
    expect(unsupportedMessage).toBeNull();
    
    // 6. Restore the original window object
    global.window = originalWindow;
  });
});
