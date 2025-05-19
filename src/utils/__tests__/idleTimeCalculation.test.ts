import { TimelineEntry } from '../../types';

// Helper function to mimic idle time calculation logic from Summary component
function calculateIdleTime(entries: TimelineEntry[]): number {
  if (!entries || entries.length === 0) return 0;
  
  let idleTime = 0;
  let lastEndTime: number | null = null;
  
  // Sort entries by start time to ensure chronological processing
  const sortedEntries = [...entries].sort((a, b) => a.startTime - b.startTime);
  
  for (let i = 0; i < sortedEntries.length; i++) {
    const entry = sortedEntries[i];
    if (!entry) continue;
    
    const endTime = entry.endTime ?? Date.now();
    
    // Calculate break time between activities
    if (lastEndTime && entry.startTime !== undefined && entry.startTime > lastEndTime) {
      idleTime += Math.round((entry.startTime - lastEndTime) / 1000);
    }
    
    lastEndTime = endTime;
  }
  
  // Calculate idle time since the last activity if there is one
  if (lastEndTime && lastEndTime < Date.now()) {
    idleTime += Math.round((Date.now() - lastEndTime) / 1000);
  }
  
  return idleTime;
}

describe('Idle Time Calculation', () => {
  // Fixed timestamp for consistent testing
  const FIXED_TIME = 1609459200000; // 2021-01-01 00:00:00

  beforeEach(() => {
    // Mock Date.now() to return a fixed timestamp for deterministic results
    jest.spyOn(Date, 'now').mockImplementation(() => FIXED_TIME);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should calculate idle time with no breaks', () => {
    // Setup consecutive activities with no breaks
    const entries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 3600000, // 1 hour ago
        endTime: FIXED_TIME - 2700000,   // 45 minutes ago
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      },
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Task 2',
        startTime: FIXED_TIME - 2700000, // 45 minutes ago
        endTime: FIXED_TIME,            // Just now
        colors: {
          background: '#E3F2FD',
          text: '#0D47A1',
          border: '#1976D2'
        }
      }
    ];

    const idleTime = calculateIdleTime(entries);
    expect(idleTime).toBe(0); // No breaks between activities
  });

  it('should calculate idle time with single break', () => {
    // Setup activities with a 15-minute break
    const entries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 3600000, // 1 hour ago
        endTime: FIXED_TIME - 2700000,   // 45 minutes ago
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      },
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Task 2',
        startTime: FIXED_TIME - 1800000, // 30 minutes ago (15 minute break after Task 1)
        endTime: FIXED_TIME,            // Just now
        colors: {
          background: '#E3F2FD',
          text: '#0D47A1',
          border: '#1976D2'
        }
      }
    ];

    const idleTime = calculateIdleTime(entries);
    expect(idleTime).toBe(900); // 15 minutes = 900 seconds
  });

  it('should calculate idle time with multiple breaks', () => {
    // Setup activities with multiple breaks
    const entries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 10800000, // 3 hours ago
        endTime: FIXED_TIME - 9000000,    // 2.5 hours ago
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      },
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Task 2',
        startTime: FIXED_TIME - 7200000, // 2 hours ago (0.5 hour break)
        endTime: FIXED_TIME - 5400000,   // 1.5 hours ago
        colors: {
          background: '#E3F2FD',
          text: '#0D47A1',
          border: '#1976D2'
        }
      },
      {
        id: '3',
        activityId: 'activity-3',
        activityName: 'Task 3',
        startTime: FIXED_TIME - 3600000, // 1 hour ago (0.5 hour break)
        endTime: FIXED_TIME,            // Just now
        colors: {
          background: '#FFF3E0',
          text: '#E65100',
          border: '#F57C00'
        }
      }
    ];

    const idleTime = calculateIdleTime(entries);
    // Two 30-minute breaks = 1 hour = 3600 seconds
    expect(idleTime).toBe(3600);
  });

  it('should calculate current idle time for ongoing break', () => {
    // Setup with a completed activity and an ongoing break
    const entries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 3600000, // 1 hour ago
        endTime: FIXED_TIME - 1800000,   // 30 minutes ago
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }
      // No second activity - implies we're in a break right now
    ];

    const idleTime = calculateIdleTime(entries);
    // Ongoing break of 30 minutes = 1800 seconds
    expect(idleTime).toBe(1800);
  });

  it('should handle edge case with zero-duration activities', () => {
    // Setup activities with zero duration
    const entries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 3600000, // 1 hour ago
        endTime: FIXED_TIME - 3600000,   // Same time (zero duration)
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      },
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Task 2',
        startTime: FIXED_TIME - 1800000, // 30 minutes ago (1800 seconds idle time)
        endTime: FIXED_TIME,            // Just now
        colors: {
          background: '#E3F2FD',
          text: '#0D47A1',
          border: '#1976D2'
        }
      }
    ];

    const idleTime = calculateIdleTime(entries);
    expect(idleTime).toBe(1800); // 30 minutes idle time
  });

  it('should handle edge case with activities out of chronological order', () => {
    // Setup activities that are not in chronological order
    const entries: TimelineEntry[] = [
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Task 2',
        startTime: FIXED_TIME - 1800000, // 30 minutes ago
        endTime: FIXED_TIME,            // Just now
        colors: {
          background: '#E3F2FD',
          text: '#0D47A1',
          border: '#1976D2'
        }
      },
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 3600000, // 1 hour ago
        endTime: FIXED_TIME - 2700000,   // 45 minutes ago
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      }
    ];

    const idleTime = calculateIdleTime(entries);
    // Expect calculation to sort activities first to get correct break time
    expect(idleTime).toBe(900); // 15 minutes break = 900 seconds
  });

  it('should handle overlapping activities as no break time', () => {
    // Setup overlapping activities
    const entries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: FIXED_TIME - 3600000, // 1 hour ago
        endTime: FIXED_TIME - 1800000,   // 30 minutes ago
        colors: {
          background: '#E8F5E9',
          text: '#1B5E20',
          border: '#2E7D32'
        }
      },
      {
        id: '2',
        activityId: 'activity-2',
        activityName: 'Task 2',
        startTime: FIXED_TIME - 2700000, // 45 minutes ago (overlaps with Task 1)
        endTime: FIXED_TIME,            // Just now
        colors: {
          background: '#E3F2FD',
          text: '#0D47A1',
          border: '#1976D2'
        }
      }
    ];

    const idleTime = calculateIdleTime(entries);
    expect(idleTime).toBe(0); // No idle time with overlapping activities
  });
});
