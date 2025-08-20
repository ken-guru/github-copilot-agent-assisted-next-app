import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import ShareControls from '../../ShareControls';
import { ToastProvider } from '../../../contexts/ToastContext';

test('ShareControls should have no basic accessibility violations', async () => {
  const { container } = render(
    <ToastProvider>
      <ShareControls shareUrl="https://example.com/shared/abc" />
    </ToastProvider>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
