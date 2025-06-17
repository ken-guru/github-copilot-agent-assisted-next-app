import React from 'react';
import { render, screen, act, within } from '@testing-library/react'; // Imported within
import Timeline from '../Timeline';
import { TimelineEntry } from '../../types';
import { formatTimeHuman } from '../../utils/time';

// Enhanced Mock react-bootstrap components
jest.mock('react-bootstrap/ListGroup', () => {
  const ListGroup = ({ children, ...props }: any) => <div {...props} role="list">{children}</div>;
  ListGroup.Item = ({ children, ...props }: any) => <div {...props} role="listitem" className="list-group-item">{children}</div>;
  return ListGroup;
});
jest.mock('react-bootstrap/Badge', () => ({ children, bg, pill, ...props }: any) => <span {...props} data-bg={bg} data-pill={pill ? pill.toString() : undefined} className={`badge ${bg ? `bg-${bg}` : ''} ${pill ? 'rounded-pill' : ''}`}>{children}</span>);
jest.mock('react-bootstrap/Container', () => ({ children, fluid, ...props }: any) => <div data-fluid={fluid ? fluid.toString() : undefined} {...props}>{children}</div>);
jest.mock('react-bootstrap/Row', () => ({ children, ...props }: any) => <div {...props}>{children}</div>);
jest.mock('react-bootstrap/Col', () => ({ children, ...props }: any) => <div {...props}>{children}</div>);


// Fixed timestamp for consistent testing
const FIXED_TIME = 1609459200000; // 2021-01-01 00:00:00

// Helper function for checking break item
const expectBreakItemWithDuration = (durationSeconds: number, testIdSuffix: string = '') => {
  const expectedDurationText = formatTimeHuman(durationSeconds * 1000);
  
  // Get all list items. We will iterate through them to find our specific break.
  const allListItems = screen.getAllByRole('listitem');
  
  let foundCorrectBreak = false;

  for (const listItem of allListItems) {
    const breakTextElement = within(listItem).queryByText(/^Break$/i);
    // Check if this list item contains the text "Break"
    if (breakTextElement) {
      // If it does, then check if it also contains a badge with the correct duration
      const badgeElement = within(listItem).queryByText(expectedDurationText);
      if (badgeElement && badgeElement.tagName === 'SPAN' && badgeElement.classList.contains('badge')) {
        foundCorrectBreak = true;
        break; // Found the specific break item we were looking for
      }
    }
  }

  if (!foundCorrectBreak) {
    console.error(`[Test Debug${testIdSuffix}] Expected break item with text "Break" AND duration "${expectedDurationText}" not found.`);
    // Output the DOM structure of all list items to help diagnose.
    console.log("[Test Debug] Current List Items in DOM:");
    allListItems.forEach((item, index) => {
      console.log(`Item ${index}:`, item.innerHTML);
    });
    // screen.debug(document.body); // Full body debug if needed
  }
  expect(foundCorrectBreak).toBe(true);
};


describe('Timeline Break Visualization', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(FIXED_TIME);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should show break immediately after activity completion', () => {
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 60000, 
        endTime: FIXED_TIME - 10000,   
      }
    ];

    render(
      <Timeline entries={mockEntries}
        totalDuration={3600}
        elapsedTime={60} 
        timerActive={true}
        allActivitiesCompleted={false} // Important for ongoing break calculation
      />
    );
    // The ongoing break is from (FIXED_TIME - 10000) to FIXED_TIME, so 10 seconds.
    expectBreakItemWithDuration(10, '-immediate');
  });

  it('should update break duration in real-time', () => {
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 120000, 
        endTime: FIXED_TIME - 30000,    
      }
    ];

    const { rerender } = render(
      <Timeline entries={mockEntries}
        totalDuration={3600}
        elapsedTime={120} 
        timerActive={true}
        allActivitiesCompleted={false} // Ongoing break after last activity
      />
    );

    // Initial ongoing break: (FIXED_TIME - 30000) to FIXED_TIME = 30 seconds.
    expectBreakItemWithDuration(30, '-update-initial');

    act(() => {
      jest.advanceTimersByTime(15000); // System time is now FIXED_TIME + 15000
    });

    // After advancing time, the component needs to re-render to pick up new Date.now()
    // The elapsedTime prop should also reflect the total time passed for the timer if it were running.
    // For an ongoing break, the timerActive=true and allActivitiesCompleted=false should trigger
    // calculateTimeSpans to use the new Date.now().
    rerender(
      <Timeline entries={mockEntries} // entries haven't changed
        totalDuration={3600}
        elapsedTime={120 + 15} // Overall timer elapsed time
        timerActive={true}
        allActivitiesCompleted={false}
      />
    );
    
    // New ongoing break: (FIXED_TIME - 30000) to (FIXED_TIME + 15000) = 45 seconds.
    expectBreakItemWithDuration(45, '-update-advanced');
  });

  it('should handle multiple break periods correctly', () => {
    const entriesForMultipleBreaks: TimelineEntry[] = [
      { 
        id: 't1',
        activityId: 'act1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 180000, // 3m ago
        endTime: FIXED_TIME - 150000,   // 2m30s ago (duration 30s)
      },
      // Break 1: (FIXED_TIME - 150000) to (FIXED_TIME - 90000). Duration: 60 seconds.
      { 
        id: 't2',
        activityId: 'act2',
        activityName: 'Task 2',
        startTime: FIXED_TIME - 90000,  // 1m30s ago
        endTime: FIXED_TIME - 60000,    // 1m ago (duration 30s)
      }
      // Current Break 2 (ongoing): (FIXED_TIME - 60000) to FIXED_TIME. Duration: 60 seconds.
    ];

    render(
      <Timeline entries={entriesForMultipleBreaks}
        totalDuration={3600} 
        elapsedTime={180} // 3 minutes (180s) elapsed overall, matches start of t1
        timerActive={true}
        allActivitiesCompleted={false} // There's an ongoing break
      />
    );

    expectBreakItemWithDuration(60, '-multi-fixed'); // Fixed break between t1 and t2
    expectBreakItemWithDuration(60, '-multi-ongoing'); // Ongoing break after t2
  });

  it('should stop updating break duration when a new activity starts', () => {
    const initialEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 180000, 
        endTime: FIXED_TIME - 60000,    // Ended 1 minute (60s) before FIXED_TIME
      }
    ];

    const { rerender } = render(
      <Timeline entries={initialEntries}
        totalDuration={3600}
        elapsedTime={180} 
        timerActive={true}
        allActivitiesCompleted={false} // Ongoing break initially
      />
    );

    // Initial ongoing break: (FIXED_TIME - 60000) to FIXED_TIME = 60 seconds.
    expectBreakItemWithDuration(60, '-stop-initial');

    const updatedEntries: TimelineEntry[] = [
      ...initialEntries,
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Task 2',
        startTime: FIXED_TIME,  // Starts exactly when the previous break would have ended
        endTime: null,          // Ongoing activity
      }
    ];

    rerender(
      <Timeline entries={updatedEntries}
        totalDuration={3600}
        elapsedTime={180} 
        timerActive={true}
        allActivitiesCompleted={false} // New activity is ongoing, so not all completed
      />
    );

    // The break between Task 1 and Task 2 is now fixed: (FIXED_TIME - 60000) to FIXED_TIME = 60s.
    // There should be no "ongoing" break after Task 2 because Task 2 is itself ongoing.
    expectBreakItemWithDuration(60, '-stop-fixed');

    act(() => {
      jest.advanceTimersByTime(30000); // System time is FIXED_TIME + 30000
    });
    
    rerender(
      <Timeline entries={updatedEntries}
        totalDuration={3600}
        elapsedTime={180 + 30} 
        timerActive={true}
        allActivitiesCompleted={false}
      />
    );
    
    // The fixed break should remain 60s.
    expectBreakItemWithDuration(60, '-stop-advanced-fixed');
  });
});