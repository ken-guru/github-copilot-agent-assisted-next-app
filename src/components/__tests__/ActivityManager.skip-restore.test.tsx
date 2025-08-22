import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import React, { useState } from 'react';
import ActivityManager from '../ActivityManager';

// Simple wrapper to manage removedActivityIds state during the test
const ActivityManagerTestWrapper: React.FC<{ timerActive?: boolean }>
  = ({ timerActive = true }) => {
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const handleRemove = (id: string) => setRemovedIds(prev => Array.from(new Set([...prev, id])));

  return (
    <ActivityManager
      onActivitySelect={jest.fn()}
      onActivityRemove={handleRemove}
      currentActivityId={null}
      completedActivityIds={[]}
      removedActivityIds={removedIds}
      timelineEntries={[]}
      timerActive={timerActive}
      totalDuration={0}
      elapsedTime={0}
    />
  );
};

describe.skip('ActivityManager - timer mode skip/hide and restore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('hides removed activity in timer mode, shows in hidden list, and restores it back', async () => {
    render(<ActivityManagerTestWrapper timerActive={true} />);

    // Wait for default activities to load
  await waitFor(() => expect(screen.getByText('Homework')).toBeTruthy());

    // Click remove on Homework (session hide)
    const removeBtn = screen.getByTestId('remove-activity-homework');
    fireEvent.click(removeBtn);

    // Homework should be hidden from the visible list
    await waitFor(() => {
      const list = screen.getByTestId('activity-list');
  expect(within(list).queryByText('Homework')).toBeNull();
    });

    // Toggle should indicate 1 hidden activity
    const toggle = screen.getByTestId('toggle-hidden-activities');
  expect(toggle.textContent || '').toContain('Show 1 hidden activity');

    // Open the hidden panel and verify Homework appears there
    fireEvent.click(toggle);
    const hiddenPanel = await screen.findByTestId('hidden-activities-panel');
  expect(within(hiddenPanel).getByText('Homework')).toBeTruthy();

    // Restore Homework
    const restoreBtn = within(hiddenPanel).getByTestId('restore-activity-homework');
    fireEvent.click(restoreBtn);

    // Homework should reappear in the visible list
    await waitFor(() => {
      const list = screen.getByTestId('activity-list');
  expect(within(list).getByText('Homework')).toBeTruthy();
    });

    // Toggle for hidden should disappear
  expect(screen.queryByTestId('toggle-hidden-activities')).toBeNull();
  });
});
