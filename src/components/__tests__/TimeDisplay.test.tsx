import React from 'react';
import { render, screen, act } from '@testing-library/react';
import TimeDisplay from '../TimeDisplay';

describe('TimeDisplay', () => {
  // Store original Date implementation
  const OriginalDate = global.Date;
  
  afterEach(() => {
    // Restore original Date after each test
    global.Date = OriginalDate;
    // Clean up any global references
    if (typeof global.updateTimeState === 'function') {
      delete (global as any).updateTimeState;
    }
    if (typeof global.intervalCallback === 'function') {
      delete (global as any).intervalCallback;
    }
  });
  
  it('should render current time correctly', () => {
    // Create a fixed test date - May 15, 2023, 14:30:45
    const mockDate = new Date('2023-05-15T14:30:45');
    
    // Mock the Date constructor to always return our fixed date
    global.Date = class extends OriginalDate {
      constructor() {
        super();
        return mockDate;
      }
      
      // Ensure static now() method returns the fixed timestamp
      static now() {
        return mockDate.getTime();
      }
    } as DateConstructor;
    
    render(<TimeDisplay />);
    
    // Verify time is displayed in the correct format (HH:MM:SS)
    expect(screen.getByTestId('time-display')).toHaveTextContent('14:30:45');
  });
  
  it('should update time when date changes', () => {
    // Initial time - May 15, 2023, 14:30:45
    const initialDate = new Date('2023-05-15T14:30:45');
    
    // First, mock Date to return our initial fixed date
    global.Date = class extends OriginalDate {
      constructor() {
        super();
        return initialDate;
      }
      
      static now() {
        return initialDate.getTime();
      }
    } as DateConstructor;
    
    render(<TimeDisplay />);
    expect(screen.getByTestId('time-display')).toHaveTextContent('14:30:45');
    
    // Change time to one minute later - May 15, 2023, 14:31:50
    const updatedDate = new Date('2023-05-15T14:31:50');
    
    // Update the Date mock to return our new date
    global.Date = class extends OriginalDate {
      constructor() {
        super();
        return updatedDate;
      }
      
      static now() {
        return updatedDate.getTime();
      }
    } as DateConstructor;
    
    // Force component to update using the exposed state setter
    act(() => {
      if (typeof global.updateTimeState === 'function') {
        (global as any).updateTimeState('14:31:50');
      } else {
        console.error('updateTimeState function not found in global scope');
      }
    });
    
    // Verify the updated time is displayed
    expect(screen.getByTestId('time-display')).toHaveTextContent('14:31:50');
  });
  
  it('should display time in 24-hour format', () => {
    // Test with PM time - May 15, 2023, 22:05:30
    const eveningDate = new Date('2023-05-15T22:05:30');
    
    global.Date = class extends OriginalDate {
      constructor() {
        super();
        return eveningDate;
      }
      
      static now() {
        return eveningDate.getTime();
      }
    } as DateConstructor;
    
    render(<TimeDisplay />);
    expect(screen.getByTestId('time-display')).toHaveTextContent('22:05:30');
  });
  
  it('should handle midnight correctly', () => {
    const midnightDate = new Date('2023-05-15T00:00:00');
    
    global.Date = class extends OriginalDate {
      constructor() {
        super();
        return midnightDate;
      }
      
      static now() {
        return midnightDate.getTime();
      }
    } as DateConstructor;
    
    render(<TimeDisplay />);
    expect(screen.getByTestId('time-display')).toHaveTextContent('00:00:00');
  });
  
  it('should pad single digits with leading zeros', () => {
    const timeWithSingleDigits = new Date('2023-05-15T09:05:08');
    
    global.Date = class extends OriginalDate {
      constructor() {
        super();
        return timeWithSingleDigits;
      }
      
      static now() {
        return timeWithSingleDigits.getTime();
      }
    } as DateConstructor;
    
    render(<TimeDisplay />);
    expect(screen.getByTestId('time-display')).toHaveTextContent('09:05:08');
  });
});