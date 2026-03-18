import { ProgressBar as BootstrapProgressBar } from 'react-bootstrap';
import { TimelineEntry } from '@/types';
import { formatTimeHuman } from '@/utils/time';

interface ProgressBarProps {
  entries: TimelineEntry[];
  totalDuration: number; // in seconds
  elapsedTime: number; // in seconds
  timerActive?: boolean;
}

export default function ProgressBar({
  entries,
  totalDuration,
  elapsedTime,
  timerActive = false
}: ProgressBarProps) {
  // Always render the progress bar container, even if timer is inactive
  const isActive = timerActive && entries.length > 0 && totalDuration > 0;
  
  // Calculate the progress percentage (capped at 100%) when active
  const progressPercentage = isActive ? Math.min(100, (elapsedTime / totalDuration) * 100) : 0;
  
  // Determine Bootstrap variant based on progress percentage
  const getVariant = (): "success" | "info" | "warning" | "danger" => {
    if (progressPercentage < 50) return "success";
    if (progressPercentage < 75) return "info";
    if (progressPercentage < 100) return "warning";
    return "danger";
  };

  // Render time markers component
  const timeMarkersComponent = totalDuration > 0 && (
    <div className="d-flex justify-content-between mt-2 px-1" style={{ fontSize: '0.75rem', color: 'var(--bs-text-muted)' }}>
      <span>0:00</span>
      <span>{formatTimeHuman(Math.floor(totalDuration / 2) * 1000)}</span>
      <span>{formatTimeHuman(totalDuration * 1000)}</span>
    </div>
  );

  // Render progress bar component using Bootstrap
  const progressBarComponent = (
    <div style={{ opacity: !isActive ? 0.5 : 1 }}>
      <BootstrapProgressBar 
        now={progressPercentage}
        variant={isActive ? getVariant() : undefined}
        style={{ height: '16px' }}
        data-testid="bootstrap-progress-bar"
        aria-label="Progress towards total duration"
        animated={isActive && timerActive}
        striped={isActive}
      />
    </div>
  );

  return (
    <div className="w-100" data-testid="progress-container">
      {progressBarComponent}
      {timeMarkersComponent}
    </div>
  );
}