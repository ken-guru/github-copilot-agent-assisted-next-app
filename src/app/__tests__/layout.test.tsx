import { render, screen, fireEvent, act } from '@testing-library/react';
import RootLayout from '../layout';
import '@testing-library/jest-dom';

// Mock service worker registration
jest.mock('../../utils/serviceWorkerRegistration', () => ({
  registerServiceWorker: jest.fn(),
  setUpdateHandler: jest.fn(),
}));

// Mock the update notification component
jest.mock('@/components/UpdateNotification', () => ({
  UpdateNotification: ({ message, onDismiss }: { message: string; onDismiss: () => void }) => (
    <div data-testid="update-notification" onClick={onDismiss}>
      {message}
    </div>
  ),
}));

describe('RootLayout', () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    // Mock matchMedia
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: light)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Reset DOM between tests
    document.documentElement.className = '';
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('should apply theme based on system preference', () => {
    render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    );

    // With our mock returning light mode preference, light theme should be applied
    expect(document.documentElement.classList.contains('light-mode')).toBe(true);
    expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
  });

  it('should handle service worker updates', () => {
    render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    );

    // Simulate service worker update
    act(() => {
      window.dispatchEvent(
        new CustomEvent('serviceWorkerUpdateAvailable', {
          detail: { message: 'Update available' }
        })
      );
    });

    const notification = screen.getByTestId('update-notification');
    expect(notification).toHaveTextContent('Update available');

    // Test dismissal
    fireEvent.click(notification);
    expect(screen.queryByTestId('update-notification')).not.toBeInTheDocument();
  });

  it('should render children with font classes', () => {
    render(
      <RootLayout>
        <div data-testid="test-child">Test content</div>
      </RootLayout>
    );

    const body = document.body;
    expect(body.className).toMatch(/--font-geist-sans/);
    expect(body.className).toMatch(/--font-geist-mono/);
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });
});