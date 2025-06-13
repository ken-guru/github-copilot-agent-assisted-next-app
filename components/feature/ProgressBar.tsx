import React, { useState, useEffect, useMemo } from 'react';
import { formatTimeHuman } from '@lib/time';
import type { TimelineEntry } from './Timeline';

/**
 * Props for the ProgressBar component
 * 
 * @interface ProgressBarProps
 */
export interface ProgressBarProps {
  /**
   * Timeline entries to visualize in the progress bar
   */
  entries: TimelineEntry[];
  
  /**
   * Total duration in seconds for the progress bar
   */
  totalDuration: number;
  
  /**
   * Current elapsed time in seconds
   */
  elapsedTime: number;
  
  /**
   * Whether the timer is currently active
   * @default false
   */
  timerActive?: boolean;
}

export default function ProgressBar({
  entries,
  totalDuration,
  elapsedTime,
  // This prop is currently unused but kept for future features
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  timerActive = false
}: ProgressBarProps) {
  // Calculate progress percentage
  const progressPercentage = Math.min(100, (elapsedTime / totalDuration) * 100);
  
  // Calculate progress color based on percentage
  const progressColor = useMemo(() => {
    return calculateProgressColor(progressPercentage);
  }, [progressPercentage]);

  // Helper function to calculate color based on progress percentage
  function calculateProgressColor(timeRatio: number): string {
    // Constants for color hue values
    const GREEN_HUE = 142;
    const YELLOW_HUE = 48;
    const ORANGE_HUE = 25;
    const RED_HUE = 0;
    const DEFAULT_SATURATION = "85%";
    const DEFAULT_LIGHTNESS = "45%";
    
    // Helper function to interpolate between two values
    const interpolateValue = (ratio: number, min: number, max: number) => {
      return min + (max - min) * ratio;
    };
    
    // Color transitions based on progress
    if (timeRatio < 0.5) {
      // Between 0% and 50%: Green to Yellow
      const hue = interpolateValue(timeRatio / 0.5, GREEN_HUE, YELLOW_HUE);
      return `hsl(${hue}, ${DEFAULT_SATURATION}, ${DEFAULT_LIGHTNESS})`;
    } else if (timeRatio < 0.75) {
      // Between 50% and 75%: Yellow to Orange
      const hue = interpolateValue((timeRatio - 0.5) / 0.25, YELLOW_HUE, ORANGE_HUE);
      return `hsl(${hue}, ${DEFAULT_SATURATION}, ${DEFAULT_LIGHTNESS})`;
    } else {
      // Between 75% and 100%: Orange to Red
      const hue = interpolateValue((timeRatio - 0.75) / 0.25, ORANGE_HUE, RED_HUE);
      return `hsl(${hue}, ${DEFAULT_SATURATION}, ${DEFAULT_LIGHTNESS})`;
    }
  };

  // Render time markers component
  const timeMarkersComponent = totalDuration > 0 && (
    <div>
      <span>0:00</span>
      <span>{formatTimeHuman(Math.floor(totalDuration / 2) * 1000)}</span>
      <span>{formatTimeHuman(totalDuration * 1000)}</span>
    </div>
  );

  // Render progress bar component
  const progressBarComponent = (
    <div role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progressPercentage}
    >
      <div style={{ width: `${progressPercentage}%`, backgroundColor: progressColor }}
        data-testid="progress-indicator"
      />
    </div>
  );

  // Main container - adjust layout for mobile devices
  return (
    <div>
      {progressBarComponent}
      {timeMarkersComponent}
    </div>
  );
}
