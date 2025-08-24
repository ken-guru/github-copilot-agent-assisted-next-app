"use client";
import React, { useMemo } from 'react';
import { useGlobalTimer } from '@/contexts/GlobalTimerContext';
import { formatTime } from '@/utils/timeUtils';
import Link from 'next/link';

const ActiveBreakCard: React.FC = () => {
  const { currentBreakStartTime, setCurrentPage } = useGlobalTimer();

  const elapsed = useMemo(() => {
    if (!currentBreakStartTime) return 0;
    const now = Date.now();
    return Math.max(0, Math.floor((now - currentBreakStartTime) / 1000));
  }, [currentBreakStartTime]);

  if (!currentBreakStartTime) return null;

  const handleClick = () => {
    try {
      setCurrentPage('timer');
    } catch (err) {
      // Non-blocking; aids debugging if something goes wrong in tests
      console.error('Failed to set current page to timer (break card):', err);
    }
  };

  return (
    <Link
      href="/"
      className="text-reset text-decoration-none"
      onClick={handleClick}
      aria-label={`Break elapsed ${formatTime(elapsed)}`}
      data-testid="active-break-card"
    >
      <div className="card border border-info" style={{ background: 'var(--bs-body-bg)' }}>
        <div className="card-body py-2 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-cup-hot text-info" aria-hidden="true" />
            <span className="fw-semibold">On break</span>
          </div>
          <span className="badge text-bg-secondary" aria-label="Break elapsed time">
            {formatTime(elapsed)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ActiveBreakCard;
