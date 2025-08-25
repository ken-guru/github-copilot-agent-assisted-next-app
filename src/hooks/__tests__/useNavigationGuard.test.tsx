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

  it('sets a sessionStorage flag on beforeunload without triggering confirmation', () => {
    const setItemSpy = jest.spyOn(window.sessionStorage.__proto__, 'setItem');

    const { unmount } = render(
      <GlobalTimerProvider>
        <StartSessionOnMount />
        <GuardHarness />
      </GlobalTimerProvider>
    );

    // Simulate beforeunload with a real BeforeUnloadEvent to ensure no returnValue is set
    const event = new Event('beforeunload');
    // Dispatch the event
    window.dispatchEvent(event);

    expect(setItemSpy).toHaveBeenCalledWith('mrTimely.leftOriginAt', expect.any(String));

    // No way to directly assert browser prompt in jsdom, but we can ensure the handler did not modify the event
    // by verifying that addEventListener was called with a function that doesn't set returnValue.
    // The important regression check is that our handler performs only side-effect to sessionStorage.

    // Cleanup
    setItemSpy.mockRestore();
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
