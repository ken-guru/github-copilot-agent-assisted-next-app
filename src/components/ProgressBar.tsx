import React from 'react';
import { ProgressBar as BootstrapProgressBar } from 'react-bootstrap';

/**
 * Props for the ProgressBar component
 *
 * @interface ProgressBarProps
 */
export interface ProgressBarProps {
  /**
   * Total duration in seconds for the progress bar
   */
  totalDuration: number;

  /**
   * Current elapsed time in seconds
   */
  elapsedTime: number;
}

export default function ProgressBar({
  totalDuration,
  elapsedTime,
}: ProgressBarProps) {
  // Calculate progress percentage
  const progressPercentage = totalDuration > 0 ? Math.min(100, (elapsedTime / totalDuration) * 100) : 0;

  // Determine variant based on progress for visual feedback, similar to original color logic
  let variant;
  if (progressPercentage < 50) {
    variant = 'success'; // Green
  } else if (progressPercentage < 75) {
    variant = 'warning'; // Yellow/Orange
  } else {
    variant = 'danger'; // Red
  }

  return (
    <BootstrapProgressBar
      now={progressPercentage}
      aria-label="Progress bar"
      variant={variant}
      style={{ height: '20px' }} // Optional: Add some default height or manage via global styles
    />
  );
}