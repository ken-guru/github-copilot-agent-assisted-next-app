import { render, screen } from '@testing-library/react';
import { ToastProvider } from '../ToastNotificationProvider';
import ActivityManager from '../ActivityManager';

describe('ActivityManager Toast Notifications', () => {
  it('shows a toast when there are no activities', () => {
    render(
      <ToastProvider>
        <ActivityManager
          onActivitySelect={() => {}}
          currentActivityId={null}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      </ToastProvider>
    );
    expect(screen.getByTestId('global-toast')).toHaveTextContent('No activities defined');
  });
});
