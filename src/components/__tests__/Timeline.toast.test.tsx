import { render, screen } from '@testing-library/react';
import { ToastProvider } from '../ToastNotificationProvider';
import Timeline from '../Timeline';

describe('Timeline Toast Notifications', () => {
  it('shows a toast when overtime occurs', () => {
    const entries = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: Date.now() - 4000 * 1000,
        endTime: Date.now(),
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }
    ];
    render(
      <ToastProvider>
        <Timeline
          entries={entries}
          totalDuration={3600}
          elapsedTime={4000}
          timerActive={true}
          isTimeUp={true}
        />
      </ToastProvider>
    );
    expect(screen.getByTestId('global-toast')).toHaveTextContent('Overtime: You have exceeded your planned time limit.');
  });
});
