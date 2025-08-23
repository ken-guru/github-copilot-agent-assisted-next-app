"use client";
import React, { useEffect, useRef } from 'react';
import { useGlobalTimer } from '@/contexts/GlobalTimerContext';
import { formatTime } from '@/utils/timeUtils';
import { computeProgress } from '@/utils/timerProgress';

const TimerDrawer: React.FC = () => {
  const {
    sessionStartTime,
    totalDuration,
    drawerExpanded,
    setDrawerExpanded,
    addOneMinute,
    currentPage,
  } = useGlobalTimer();

  // Publish drawer height as CSS variable for optional responsive padding tuning
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return () => {};
    let ro: ResizeObserver | undefined;
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      ro = new window.ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const h = Math.ceil(entry.contentRect.height);
        document.body.style.setProperty('--timer-drawer-height', `${h}px`);
      });
      ro.observe(el);
    }
    return () => {
      ro?.disconnect();
      document.body.style.removeProperty('--timer-drawer-height');
    };
  }, []);

  // Only render when a session is active
  if (!sessionStartTime) return null;

  const { elapsed, remaining, percent } = computeProgress(
    sessionStartTime,
    totalDuration
  );

  const handleToggle = () => setDrawerExpanded(!drawerExpanded);

  return (
    <div
      ref={containerRef}
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
          {currentPage === 'timer' && !drawerExpanded && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => addOneMinute()}
            >
              Add 1 min
            </button>
          )}
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            aria-label="Expand timer drawer"
            aria-expanded={drawerExpanded}
            onClick={handleToggle}
          >
            <i
              className={`bi ${drawerExpanded ? 'bi-chevron-down' : 'bi-chevron-up'}`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Minimal inline progress indicator for cross-page visibility */}
        <div className="mt-2" aria-label="Timer progress">
          <div
            className="progress"
            style={{ height: 6 }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.floor(percent)}
            data-testid="timer-progressbar"
          >
            <div className="progress-bar" style={{ width: `${percent}%` }} />
          </div>
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
