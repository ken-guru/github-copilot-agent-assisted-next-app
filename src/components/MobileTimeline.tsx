'use client';
import React from 'react';
import { Card } from 'react-bootstrap';
import type { TimelineEntry } from '@/types';
import { formatTime } from '@/utils/time/timeFormatters';

interface MobileTimelineProps {
  entries: TimelineEntry[];
  totalDuration: number;
  currentTime: number;
}

export const MobileTimeline: React.FC<MobileTimelineProps> = ({ entries, totalDuration, currentTime }) => {
  // Helper function to extract colors from theme-aware or simple structure
  const getColors = (entry: TimelineEntry) => {
    if (!entry.colors) {
      return { background: '#e9ecef', border: '#dee2e6' };
    }
    
    if ('background' in entry.colors) {
      return entry.colors;
    }
    
    if ('light' in entry.colors) {
      return entry.colors.light;
    }
    
    return { background: '#e9ecef', border: '#dee2e6' };
  };

  return (
    <Card className="mobile-timeline-card mb-3">
      <Card.Header><h6 className="mb-0">Timeline</h6></Card.Header>
      <Card.Body className="p-2">
        {entries.length === 0 ? (
          <p className="text-muted text-center py-3 mb-0">No activities tracked yet</p>
        ) : (
          <div className="mobile-timeline-stack">
            {entries.map(entry => {
              const durationSeconds = Math.floor(((entry.endTime || currentTime) - entry.startTime) / 1000);
              const formattedDuration = formatTime(durationSeconds);
              const colors = getColors(entry);
              
              return (
                <div 
                  key={entry.id} 
                  className={`mobile-timeline-entry ${!entry.endTime ? 'active' : ''}`}
                  style={{ 
                    backgroundColor: colors.background, 
                    borderLeftColor: colors.border 
                  }}
                >
                  <div className="entry-header">
                    <span className="entry-name">{entry.activityName || 'Break'}</span>
                    {!entry.endTime && <span className="badge bg-success">Running</span>}
                  </div>
                  <div className="entry-meta">
                    <span>{formattedDuration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
