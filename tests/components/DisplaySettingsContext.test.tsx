import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { 
  DisplaySettingsProvider, 
  useDisplaySettings 
} from '../../components/contexts/DisplaySettingsContext';

// Test component that uses the context
const TestComponent = () => {
  const { keepDisplayOn, toggleKeepDisplayOn } = useDisplaySettings();
  
  return (
    <div>
      <div data-testid="display-status">{keepDisplayOn ? 'on' : 'off'}</div>
      <button data-testid="toggle-btn" onClick={toggleKeepDisplayOn}>Toggle</button>
    </div>
  );
};

// Mock localStorage
const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    })
  };
};

describe('DisplaySettingsContext', () => {
  let originalLocalStorage: Storage;
  
  beforeEach(() => {
    originalLocalStorage = global.localStorage;
    const mockStorage = mockLocalStorage();
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true
    });
  });
  
  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
  });
  
  it('provides default value of keepDisplayOn as false regardless of environment', () => {
    render(
      <DisplaySettingsProvider>
        <TestComponent />
      </DisplaySettingsProvider>
    );
    
    expect(screen.getByTestId('display-status').textContent).toBe('off');
  });
  
  it('toggles keepDisplayOn value when toggleKeepDisplayOn is called', () => {
    render(
      <DisplaySettingsProvider>
        <TestComponent />
      </DisplaySettingsProvider>
    );
    
    expect(screen.getByTestId('display-status').textContent).toBe('off');
    
    fireEvent.click(screen.getByTestId('toggle-btn'));
    expect(screen.getByTestId('display-status').textContent).toBe('on');
    
    fireEvent.click(screen.getByTestId('toggle-btn'));
    expect(screen.getByTestId('display-status').textContent).toBe('off');
  });
  
  it('persists keepDisplayOn value in localStorage on client side', () => {
    const { getItem, setItem } = window.localStorage;
    
    render(
      <DisplaySettingsProvider>
        <TestComponent />
      </DisplaySettingsProvider>
    );
    
    // Toggle and check if localStorage is updated
    fireEvent.click(screen.getByTestId('toggle-btn'));
    expect(setItem).toHaveBeenCalledWith('keepDisplayOn', 'true');
    
    // Clear mocks to check the retrieval
    (setItem as jest.Mock).mockClear();
    
    // Simulate localStorage having a value
    (getItem as jest.Mock).mockReturnValueOnce('true');
    
    render(
      <DisplaySettingsProvider>
        <TestComponent />
      </DisplaySettingsProvider>
    );
    
    // Should initialize with value from localStorage
    expect(screen.getByTestId('display-status').textContent).toBe('on');
    expect(getItem).toHaveBeenCalledWith('keepDisplayOn');
  });
  
  it('ensures hydration consistency between server and client', () => {
    // Simulate server environment (no window)
    const originalWindow = global.window;
    // @ts-ignore - Deliberately setting window to undefined to simulate server environment
    global.window = undefined;
    
    const { container: serverContainer } = render(
      <DisplaySettingsProvider>
        <TestComponent />
      </DisplaySettingsProvider>
    );
    
    const serverHTML = serverContainer.innerHTML;
    
    // Restore window for client rendering
    global.window = originalWindow;
    
    const { container: clientContainer } = render(
      <DisplaySettingsProvider>
        <TestComponent />
      </DisplaySettingsProvider>
    );
    
    const clientHTML = clientContainer.innerHTML;
    
    // The HTML structure should match to avoid hydration mismatches
    expect(serverHTML).toEqual(clientHTML);
  });
});
