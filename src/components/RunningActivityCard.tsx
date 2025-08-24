"use client";
import React, { useMemo } from 'react';
import { useGlobalTimer } from '@/contexts/GlobalTimerContext';
import { getActivityColors } from '@/utils/colors';
import { formatTime } from '@/utils/timeUtils';
// Avoid useRouter to simplify testing; use Next.js Link navigation
import Link from 'next/link';

const RunningActivityCard: React.FC = () => {
  const { currentActivity, currentActivityStartTime, setCurrentPage } = useGlobalTimer();

  const colors = getActivityColors();

  const { name, colorStyle, elapsed } = useMemo(() => {
    const name = currentActivity?.name ?? '';
    const idx = currentActivity?.colorIndex ?? 0;
    const set = colors[Math.max(0, Math.min(idx, colors.length - 1))] ?? colors[0];
    const now = Date.now();
    const elapsedSeconds = currentActivityStartTime ? Math.max(0, Math.floor((now - currentActivityStartTime) / 1000)) : 0;
    return {
      name,
      colorStyle: {
        backgroundColor: set?.background,
        borderColor: set?.border,
        color: set?.text,
      } as React.CSSProperties,
      elapsed: elapsedSeconds,
    };
  }, [currentActivity, currentActivityStartTime, colors]);

  if (!currentActivity) return null;

  const handleClick = () => {
    // Update page state for internal consumers
    try {
      setCurrentPage('timer');
    } catch (err) {
      // Log to aid debugging; this should be very rare and non-blocking
      console.error('Failed to set current page to timer:', err);
    }
  };

  return (
    <Link
      href="/"
      className="text-reset text-decoration-none"
      onClick={handleClick}
      aria-label={`Current activity ${name}, elapsed ${formatTime(elapsed)}`}
      data-testid="running-activity-card"
    >
      <div className="card border" style={colorStyle}>
        <div className="card-body py-2 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span
              aria-hidden="true"
              className="rounded-circle d-inline-block"
              style={{ width: 10, height: 10, backgroundColor: colorStyle.borderColor as string }}
            />
            <span className="fw-semibold text-truncate" style={{ maxWidth: '60vw' }}>
              {name}
            </span>
          </div>
          <span className="badge text-bg-secondary" aria-label="Activity elapsed time">
            {formatTime(elapsed)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RunningActivityCard;
