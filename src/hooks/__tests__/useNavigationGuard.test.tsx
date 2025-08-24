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

  it('sets a sessionStorage flag on beforeunload when a session is active', () => {
    const originalSetItem = window.sessionStorage.setItem;
    const setItemSpy = jest.spyOn(window.sessionStorage.__proto__, 'setItem');

    const { unmount } = render(
      <GlobalTimerProvider>
        <StartSessionOnMount />
        <GuardHarness />
      </GlobalTimerProvider>
    );

    // Simulate beforeunload
    const event = new Event('beforeunload');
    window.dispatchEvent(event);

    expect(setItemSpy).toHaveBeenCalledWith('mrTimely.leftOriginAt', expect.any(String));

    // Cleanup
    setItemSpy.mockRestore();
    // restore in case
    window.sessionStorage.setItem = originalSetItem;
    unmount();
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
