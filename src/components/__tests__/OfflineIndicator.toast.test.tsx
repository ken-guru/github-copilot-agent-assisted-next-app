import { render, screen } from '@testing-library/react';
import { ToastProvider } from '../ToastNotificationProvider';
import { OfflineIndicator } from '../OfflineIndicator';

jest.mock('../../hooks/useOnlineStatus', () => ({
  useOnlineStatus: jest.fn()
}));
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

describe('OfflineIndicator Toast Notifications', () => {
  const mockedUseOnlineStatus = useOnlineStatus as jest.MockedFunction<typeof useOnlineStatus>;
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('shows a toast when offline', () => {
    mockedUseOnlineStatus.mockReturnValue(false);
    render(
      <ToastProvider>
        <OfflineIndicator />
      </ToastProvider>
    );
    expect(screen.getByTestId('global-toast')).toHaveTextContent('You are offline');
  });
});
