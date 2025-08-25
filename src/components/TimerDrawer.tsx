"use client";
import React, { useEffect, useRef } from 'react';
import { useGlobalTimer } from '@/contexts/GlobalTimerContext';
import { formatTime } from '@/utils/timeUtils';
import useGlobalTimerProgress from '@/hooks/useGlobalTimerProgress';
import RunningActivityCard from '@/components/RunningActivityCard';
import ActiveBreakCard from '@/components/ActiveBreakCard';
import AddMinuteButton from '@/components/AddMinuteButton';

const TimerDrawer: React.FC = () => {
  const {
    sessionStartTime,
    drawerExpanded,
    setDrawerExpanded,
    addOneMinute,
    currentPage,
    currentActivity,
    currentBreakStartTime,
  } = useGlobalTimer();

  // Always subscribe to progress so hook order stays consistent across renders
  const { elapsed, remaining, percent } = useGlobalTimerProgress(1000);

  // Publish drawer height as CSS variable for optional responsive padding tuning
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return () => {};
    let ro: ResizeObserver | undefined;
    if ('ResizeObserver' in window) {
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

  // Only render when a session is active (progress hook still ran to keep hook order stable)
  if (!sessionStartTime) return null;

  const handleToggle = () => setDrawerExpanded(!drawerExpanded);

  return (
    <div
      ref={containerRef}
      data-testid="timer-drawer"
      className={[
        'position-fixed',
        'bottom-0',
        'start-0',
        'end-0',
        'bg-body',
        'border-top',
        'shadow-sm',
        'timer-drawer',
        drawerExpanded ? 'is-expanded' : 'is-collapsed',
      ].join(' ')}
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
            <AddMinuteButton
              onClick={() => addOneMinute()}
              variant="primary"
              size="sm"
              ariaLabel="Add 1 min"
            />
          )}
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            aria-label={drawerExpanded ? 'Collapse timer drawer' : 'Expand timer drawer'}
            aria-expanded={drawerExpanded}
            aria-controls="timer-drawer-content"
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

        <div
          id="timer-drawer-content"
          className={`mt-3 drawer-collapse ${drawerExpanded ? 'show' : ''}`}
          data-testid={drawerExpanded ? 'drawer-expanded-content' : undefined}
        >
          {drawerExpanded && (
            <div className="d-flex flex-column gap-2">
              {/* Running activity or active break summary card */}
              {currentActivity ? <RunningActivityCard /> : currentBreakStartTime ? <ActiveBreakCard /> : null}

              {/* Quick actions */}
              <div className="d-flex gap-2 flex-nowrap" data-testid="drawer-actions-row">
                <AddMinuteButton
                  onClick={() => addOneMinute()}
                  variant="primary"
                  size="sm"
                  ariaLabel="Add 1 min"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimerDrawer;
