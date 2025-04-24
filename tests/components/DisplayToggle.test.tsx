import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DisplayToggle from '../../components/ui/DisplayToggle';
import { DisplaySettingsProvider } from '../../components/contexts/DisplaySettingsContext';

// Mock @headlessui/react
jest.mock('@headlessui/react', () => require('../mocks/headlessui-react'));

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
    expect(screen.getByText(/Keep Display On/i)).toBeInTheDocument();
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
    // Update the mock to indicate no support
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
    
    // Now simulate server rendering
    // @ts-ignore - Deliberately setting window to undefined to simulate server environment
    global.window = undefined;
    
    const { queryByText: queryServerText } = render(
      <DisplaySettingsProvider>
        <DisplayToggle />
      </DisplaySettingsProvider>
    );
    
    // Should not show the unsupported message on server
    expect(queryServerText(/not supported/i)).not.toBeInTheDocument();
    
    // Restore window
    global.window = originalWindow;
  });
});
