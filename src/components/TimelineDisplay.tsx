import React from 'react';
import Timeline from './Timeline';
import { TimelineEntry } from '../types';

interface TimelineDisplayProps {
  entries: TimelineEntry[];
}

/**
 * TimelineDisplay Component
 * 
 * Displays a collection of timeline entries using the Timeline component.
 * This component serves as a wrapper that can add additional functionality
 * around the Timeline component like filtering or sorting in the future.
 */
const TimelineDisplay: React.FC<TimelineDisplayProps> = ({ entries }) => {
  return (
    <div className="timeline-display">
      <Timeline entries={entries} />
    </div>
  );
};

export default TimelineDisplay;