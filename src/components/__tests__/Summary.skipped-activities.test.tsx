import { render, screen } from '@testing-library/react';
import React from 'react';
import Summary from '../Summary';
import { ToastProvider } from '@/contexts/ToastContext';

const renderWithProviders = (ui: React.ReactElement) => render(<ToastProvider>{ui}</ToastProvider>);

describe('Summary - skipped activities section', () => {
  it('renders skipped activities with names from storage when all activities completed', () => {
  renderWithProviders(
      <Summary
        entries={[]}
        totalDuration={60}
        elapsedTime={60}
        allActivitiesCompleted={true}
        skippedActivityIds={["1", "3"]}
      />
    );

    const skippedSection = screen.getByTestId('skipped-activities');
    expect(skippedSection).toBeInTheDocument();
    expect(skippedSection).toHaveTextContent('Skipped activities (2)');

    // Names resolved from default activities config
    expect(screen.getByTestId('skipped-activity-name-1')).toHaveTextContent('Homework');
    expect(screen.getByTestId('skipped-activity-name-3')).toHaveTextContent('Play Time');
  });

  it('does not render skipped section when none skipped', () => {
  renderWithProviders(
      <Summary
        entries={[]}
        totalDuration={60}
        elapsedTime={60}
        allActivitiesCompleted={true}
        skippedActivityIds={[]}
      />
    );

    expect(screen.queryByTestId('skipped-activities')).not.toBeInTheDocument();
  });
});
