'use client';
import React from 'react';
import { useGlobalTimer } from '@/contexts/GlobalTimerContext';
import { formatTime } from '@/utils/timeUtils';

function secondsBetween(fromMs: number, toMs: number): number {
  return Math.max(0, Math.floor((toMs - fromMs) / 1000));
}

const TimerDrawer: React.FC = () => {
  const {
    sessionStartTime,
    totalDuration,
    drawerExpanded,
    setDrawerExpanded,
    addOneMinute,
  } = useGlobalTimer();

  // Only render when a session is active
  if (!sessionStartTime) return null;

  const now = Date.now();
  const elapsed = secondsBetween(sessionStartTime, now);
  const remaining = Math.max(0, totalDuration - elapsed);

  const handleToggle = () => setDrawerExpanded(!drawerExpanded);

  return (
    <div
      data-testid="timer-drawer"
      className="position-fixed bottom-0 start-0 end-0 bg-body border-top shadow-sm"
      style={{ zIndex: 1030 }}
      role="region"
      aria-label="Timer drawer"
    >
      <div className="container py-2">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex gap-3 align-items-baseline">
            <div className="text-muted small">Elapsed</div>
            <div data-testid="elapsed-time" className="fw-semibold">
              {formatTime(elapsed)}
            </div>
          </div>
          <div className="d-flex gap-3 align-items-baseline">
            <div className="text-muted small">Remaining</div>
            <div data-testid="remaining-time" className="fw-semibold">
              {formatTime(remaining)}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            aria-label="Expand timer drawer"
            aria-expanded={drawerExpanded}
            onClick={handleToggle}
          >
            <i className={`bi ${drawerExpanded ? 'bi-chevron-down' : 'bi-chevron-up'}`} aria-hidden="true" />
          </button>
        </div>

        {drawerExpanded && (
          <div className="mt-3" data-testid="drawer-expanded-content">
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => addOneMinute()}
              >
                Add 1 min
              </button>
              {/* Placeholder for future controls: complete activity, reset, etc. */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimerDrawer;
