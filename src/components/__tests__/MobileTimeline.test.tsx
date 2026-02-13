import React from 'react';
import { render, screen } from '@testing-library/react';
import { MobileTimeline } from '../MobileTimeline';
import type { TimelineEntry } from '@/types';

describe('MobileTimeline Component', () => {
  const mockEntries: TimelineEntry[] = [
    {
      id: '1',
      activityId: 'act1',
      activityName: 'Test Activity',
      startTime: Date.now() - 600000, // 10 minutes ago
      endTime: Date.now(),
      colors: {
        background: '#007bff',
        text: '#ffffff',
        border: '#0056b3'
      }
    },
    {
      id: '2',
      activityId: 'act2',
      activityName: 'Running Activity',
      startTime: Date.now() - 300000, // 5 minutes ago
      endTime: null, // Still running
      colors: {
        background: '#28a745',
        text: '#ffffff',
        border: '#1e7e34'
      }
    }
  ];

  test('renders timeline entries', () => {
    render(
      <MobileTimeline 
        entries={mockEntries} 
        totalDuration={600000} 
        currentTime={Date.now()} 
      />
    );
    
    expect(screen.getByText('Test Activity')).toBeInTheDocument();
    expect(screen.getByText('Running Activity')).toBeInTheDocument();
  });

  test('shows empty state when no entries', () => {
    render(
      <MobileTimeline 
        entries={[]} 
        totalDuration={600000} 
        currentTime={Date.now()} 
      />
    );
    
    expect(screen.getByText('No activities tracked yet')).toBeInTheDocument();
  });

  test('displays running badge for active entries', () => {
    render(
      <MobileTimeline 
        entries={mockEntries} 
        totalDuration={600000} 
        currentTime={Date.now()} 
      />
    );
    
    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  test('displays break entry correctly', () => {
    const breakEntry: TimelineEntry[] = [{
      id: '3',
      activityId: null,
      activityName: null,
      startTime: Date.now() - 300000,
      endTime: Date.now(),
      colors: {
        background: '#e9ecef',
        text: '#495057',
        border: '#dee2e6'
      }
    }];
    
    render(
      <MobileTimeline 
        entries={breakEntry} 
        totalDuration={600000} 
        currentTime={Date.now()} 
      />
    );
    
    expect(screen.getByText('Break')).toBeInTheDocument();
  });
});
