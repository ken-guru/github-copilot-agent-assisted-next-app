import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ShareControls from '../ShareControls';

// Mock next/navigation's useRouter to avoid runtime mount errors in Jest
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock useResponsiveToast used by ShareControls
jest.mock('@/hooks/useResponsiveToast', () => ({
  useResponsiveToast: () => ({ addResponsiveToast: jest.fn() }),
}));

describe('ShareControls offline behavior', () => {
  const originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(window, 'navigator');

  afterEach(() => {
    if (originalNavigatorDescriptor) {
      Object.defineProperty(window, 'navigator', originalNavigatorDescriptor);
    }
  });

  it('disables download/open/replace buttons when offline', () => {
    Object.defineProperty(window, 'navigator', {
      configurable: true,
      value: { onLine: false },
    });

    render(<ShareControls shareUrl="/shared/123" showOpen={true} showReplace={true} />);

  // Copy button should be enabled (no network required)
  const copyButton = screen.getByRole('button', { name: /copy share link/i });
  expect(copyButton).toBeEnabled();

  const downloadButton = screen.getByRole('button', { name: /download json/i });
  expect(downloadButton).toBeDisabled();

  // Replace action should be disabled while offline
  const replaceButton = screen.getByRole('button', { name: /replace my activities/i });
  expect(replaceButton).toBeDisabled();
  });
});
