import { render, screen, waitFor } from '@testing-library/react';
import ActivityManager from '../ActivityManager';
import { DEFAULT_ACTIVITIES } from '../../types/activity';

describe('ActivityManager removal behavior', () => {
  const mockOnActivitySelect = jest.fn();
  const mockOnActivityRemove = jest.fn();

  beforeEach(() => {
    mockOnActivitySelect.mockClear();
    mockOnActivityRemove.mockClear();
    localStorage.setItem('activities_v1', JSON.stringify(DEFAULT_ACTIVITIES));
  });

  it('filters out removed activities from the visible list', async () => {
    render(
      <ActivityManager
        onActivitySelect={mockOnActivitySelect}
        onActivityRemove={mockOnActivityRemove}
        currentActivityId={null}
        completedActivityIds={[]}
        removedActivityIds={[DEFAULT_ACTIVITIES[0]!.id]} // remove Homework
        timelineEntries={[]}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Homework')).not.toBeInTheDocument();
      expect(screen.getByText('Reading')).toBeInTheDocument();
    });
  });
});
