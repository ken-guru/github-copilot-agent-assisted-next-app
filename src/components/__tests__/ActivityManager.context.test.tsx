import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import ActivityManager from '../ActivityManager';
import { GlobalTimerProvider } from '../../contexts/GlobalTimerContext';

// Mock color selection util to avoid theme coupling
jest.mock('../../utils/colors', () => ({
  ...jest.requireActual('../../utils/colors'),
  getNextAvailableColorSet: jest.fn().mockImplementation(() => ({
    background: '#E8F5E9',
    text: '#1B5E20',
    border: '#2E7D32'
  }))
}));

// Utility wrapper with GlobalTimerProvider
function renderWithTimer(ui: React.ReactElement) {
  return render(<GlobalTimerProvider>{ui}</GlobalTimerProvider>);
}


describe('ActivityManager + GlobalTimerContext integration', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('calls addOneMinute via onExtendDuration wiring', async () => {
    const onExtendSpy = jest.fn();
    renderWithTimer(
      <ActivityManager
        onActivitySelect={jest.fn()}
        onActivityRemove={jest.fn()}
        currentActivityId={null}
        completedActivityIds={[]}
        timelineEntries={[]}
        onExtendDuration={onExtendSpy}
      />
    );

    // Button should not render without prop according to current component contract
    // Provide prop above and verify it calls the callback
    const btn = screen.queryByRole('button', { name: /1 min/i });
    expect(btn).toBeInTheDocument();
    if (!btn) throw new Error('extend button missing');
    fireEvent.click(btn);
    expect(onExtendSpy).toHaveBeenCalledTimes(1);
  });

  it('resets via onReset wiring and keeps layout intact', async () => {
    const onResetSpy = jest.fn();
    renderWithTimer(
      <ActivityManager
        onActivitySelect={jest.fn()}
        onActivityRemove={jest.fn()}
        currentActivityId={null}
        completedActivityIds={[]}
        timelineEntries={[]}
        onReset={onResetSpy}
      />
    );

    const reset = screen.getByRole('button', { name: /Reset/i });
    fireEvent.click(reset);
    expect(onResetSpy).toHaveBeenCalledTimes(1);

    // Card should remain mounted
    expect(screen.getByTestId('activity-manager')).toBeInTheDocument();
  });

  it('selects an activity on Start and completes it via Complete when running', async () => {
    const onActivitySelect = jest.fn();
    const { rerender } = renderWithTimer(
      <ActivityManager
        onActivitySelect={onActivitySelect}
        onActivityRemove={jest.fn()}
        currentActivityId={null}
        completedActivityIds={[]}
        timelineEntries={[]}
      />
    );

    // Ensure defaults render
    await waitFor(() => expect(screen.getByText('Homework')).toBeInTheDocument());

    // Clear initial onActivitySelect calls from mount synchronization
    onActivitySelect.mockClear();

    // Start homework (scope the query within the homework card to avoid ambiguity)
    const homeworkCard = screen.getByTestId('activity-column-1');
    const startBtn = within(homeworkCard).getByRole('button', { name: 'Start' });
    fireEvent.click(startBtn);
    expect(onActivitySelect).toHaveBeenCalledTimes(1);
    expect(onActivitySelect.mock.calls[0][0]).toMatchObject({ id: '1', name: 'Homework' });

    // Simulate running state for Homework and click Complete
    onActivitySelect.mockClear();
    rerender(
      <GlobalTimerProvider>
        <ActivityManager
          onActivitySelect={onActivitySelect}
          onActivityRemove={jest.fn()}
          currentActivityId={'1'}
          completedActivityIds={[]}
          timelineEntries={[]}
        />
      </GlobalTimerProvider>
    );

    // Find Complete button within the same card and click it
    const completeBtn = within(screen.getByTestId('activity-column-1')).getByRole('button', { name: 'Complete' });
    fireEvent.click(completeBtn);
    expect(onActivitySelect).toHaveBeenCalledWith(null);
  });
});
