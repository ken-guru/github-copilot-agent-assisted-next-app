import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import ShareControls from '../../ShareControls';
import { ToastProvider } from '../../../contexts/ToastContext';

// Mock Next.js app router to avoid invariant about router being mounted
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

test('ShareControls should have no basic accessibility violations', async () => {
  const { container } = render(
    <ToastProvider>
      <ShareControls shareUrl="https://example.com/shared/abc" />
    </ToastProvider>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
