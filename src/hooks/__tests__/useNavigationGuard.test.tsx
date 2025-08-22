import React from 'react';
import { render } from '@testing-library/react';
import { GlobalTimerProvider, useGlobalTimer } from '../../contexts/GlobalTimerContext';
import { useNavigationGuard } from '../useNavigationGuard';

function GuardHarness() {
  useNavigationGuard();
  return null;
}

function StartSessionOnMount() {
  const { startSession } = useGlobalTimer();
  React.useEffect(() => {
    startSession(10);
  }, [startSession]);
  return null;
}

function StopSessionOnMount() {
  const { resetSession } = useGlobalTimer();
  React.useEffect(() => {
    resetSession();
  }, [resetSession]);
  return null;
}

describe('useNavigationGuard', () => {
  const addEventSpy = jest.spyOn(window, 'addEventListener');
  const removeEventSpy = jest.spyOn(window, 'removeEventListener');

  beforeEach(() => {
    addEventSpy.mockClear();
    removeEventSpy.mockClear();
  });

  it('registers beforeunload when a session is running', () => {
    render(
      <GlobalTimerProvider>
        <StartSessionOnMount />
        <GuardHarness />
      </GlobalTimerProvider>
    );

    expect(addEventSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });

  it('removes beforeunload handler when session stops', () => {
    const { rerender } = render(
      <GlobalTimerProvider>
        <StartSessionOnMount />
        <GuardHarness />
      </GlobalTimerProvider>
    );

    rerender(
      <GlobalTimerProvider>
        <StopSessionOnMount />
        <GuardHarness />
      </GlobalTimerProvider>
    );

    expect(removeEventSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });
});
