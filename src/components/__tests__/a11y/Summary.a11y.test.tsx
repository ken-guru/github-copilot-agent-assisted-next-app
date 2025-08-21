import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import Summary from '../../Summary';
import { ToastProvider } from '../../../contexts/ToastContext';

test('Summary should have no basic accessibility violations', async () => {
  const { container } = render(
    <ToastProvider>
      <Summary totalDuration={60} elapsedTime={60} entries={[]} allActivitiesCompleted={true} />
    </ToastProvider>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
