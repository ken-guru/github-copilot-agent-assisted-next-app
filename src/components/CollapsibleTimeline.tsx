'use client';
import React, { useState } from 'react';
import { Collapse, Button } from 'react-bootstrap';
import { MobileTimeline } from './MobileTimeline';
import type { TimelineEntry } from '@/types';

interface CollapsibleTimelineProps {
  entries: TimelineEntry[];
  totalDuration: number;
  currentTime: number;
}

export const CollapsibleTimeline: React.FC<CollapsibleTimelineProps> = ({ 
  entries, 
  totalDuration, 
  currentTime 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="d-lg-none">
      <Button 
        variant="outline-primary" 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-100 mb-2"
        aria-expanded={isOpen}
        aria-controls="mobile-timeline-collapse"
      >
        {isOpen ? '▼' : '▶'} Timeline {entries.length > 0 && `(${entries.length})`}
      </Button>
      <Collapse in={isOpen}>
        <div id="mobile-timeline-collapse">
          <MobileTimeline entries={entries} totalDuration={totalDuration} currentTime={currentTime} />
        </div>
      </Collapse>
    </div>
  );
};
