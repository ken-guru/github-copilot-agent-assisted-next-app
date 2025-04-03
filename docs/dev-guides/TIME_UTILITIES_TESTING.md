# Testing Time Utilities: Best Practices

This document provides guidance on testing time-related functionality in our application, with a focus on best practices and common patterns.

## General Principles

Testing time-related functionality presents unique challenges:
- Time-dependent tests can be flaky
- Real-time dependencies make tests slow
- Timing issues can be hard to reproduce

Our approach addresses these challenges through:
- Mocking time-related browser APIs
- Using deterministic time values
- Creating dedicated testing utilities

## Testing Utilities Overview

Our testing utilities for time-related functionality are in:
- `/src/utils/testUtils/timeUtils.ts`

Key utilities include:

1. **Time formatting** - Consistent time string formatting for test assertions
2. **Time mocking** - Control over timers and time advancement
3. **Duration calculation** - Helpers for calculating time periods

## Mock Timer Setup

### Basic Timer Mocking

```typescript
import { createTimerMock } from '../../utils/testUtils';

describe('Component with timers', () => {
  // Set up mock timer controls
  const { advanceTime, clearAllTimers } = createTimerMock();
  
  afterEach(() => {
    clearAllTimers(); // Clean up timers after each test
  });
  
  it('should update after timer fires', () => {
    render(<ComponentWithTimer />);
    
    // Advance time by 1 second
    advanceTime(1000);
    
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });
});
```

### Date Mocking

For components that use `Date.now()` directly:

```typescript
describe('Component using current time', () => {
  let originalDateNow: () => number;
  
  beforeEach(() => {
    originalDateNow = Date.now;
    let currentTime = 1600000000000; // Fixed timestamp for testing
    Date.now = jest.fn(() => currentTime);
  });
  
  afterEach(() => {
    Date.now = originalDateNow; // Restore original implementation
  });
  
  it('should display the correct time', () => {
    render(<TimeDisplay />);
    expect(screen.getByText('06:26:40')).toBeInTheDocument();
  });
});
```

## Testing Time Format Edge Cases

When testing time formatting utilities:

```typescript
import { formatTime } from '../../utils/timeUtils';

describe('formatTime', () => {
  it('handles zero values correctly', () => {
    expect(formatTime(0)).toBe('00:00');
  });
  
  it('handles negative values appropriately', () => {
    expect(formatTime(-60)).toBe('00:00'); // Or whatever the expected behavior is
  });
  
  it('formats large values correctly', () => {
    expect(formatTime(3600 * 25)).toBe('01:00:00'); // Or '25:00:00' depending on implementation
  });
});
```

## Testing Time Calculations

For utilities that calculate durations or time differences:

```typescript
import { calcDuration } from '../../utils/timeUtils';

describe('calcDuration', () => {
  it('calculates duration between timestamps', () => {
    const start = 1600000000000;
    const end = 1600000060000; // 60 seconds later
    
    expect(calcDuration(start, end)).toBe(60);
  });
  
  it('handles reversed timestamps gracefully', () => {
    const start = 1600000060000;
    const end = 1600000000000; // 60 seconds earlier
    
    // Define expected behavior - return 0, absolute value, or throw error
    expect(calcDuration(start, end)).toBe(0); // Assuming it returns 0 for reversed times
  });
});
```

## Component Testing with Time Dependencies

When testing components that depend on time:

```typescript
import { render, screen } from '@testing-library/react';
import { createTimerMock } from '../../utils/testUtils';
import TimerComponent from '../TimerComponent';

describe('TimerComponent', () => {
  const { advanceTime, clearAllTimers } = createTimerMock();
  
  afterEach(() => {
    clearAllTimers();
  });
  
  it('updates the countdown every second', () => {
    render(<TimerComponent initialTime={10} />);
    
    expect(screen.getByText('00:10')).toBeInTheDocument();
    
    advanceTime(1000);
    expect(screen.getByText('00:09')).toBeInTheDocument();
    
    advanceTime(1000);
    expect(screen.getByText('00:08')).toBeInTheDocument();
  });
});
```

## Meta-Testing Approach

For testing our test utilities themselves:

```typescript
import { formatTimeFromMs } from '../../utils/testUtils/timeUtils';

describe('Test utilities', () => {
  describe('formatTimeFromMs', () => {
    it('formats milliseconds correctly', () => {
      expect(formatTimeFromMs(65000)).toBe('00:01:05');
    });
    
    it('handles edge cases consistently', () => {
      expect(formatTimeFromMs(0)).toBe('00:00:00');
      expect(formatTimeFromMs(-1000)).toBe('00:00:00'); // Assuming negative returns zero time
    });
  });
});
```

## Common Pitfalls and Solutions

### 1. Cleanup Failures

**Problem**: Timer mocks not properly cleaned up between tests

**Solution**:
- Use `afterEach` to clear timers
- Create setup/teardown helper functions
- Use the `createTimerMock` utility which handles cleanup

### 2. Timezone Dependencies

**Problem**: Tests fail when run in different timezones

**Solution**:
- Use UTC times for consistency
- Mock timezone-specific APIs
- Avoid dependencies on local time formatting

### 3. Performance Issues

**Problem**: Tests with real timers are slow

**Solution**:
- Use fake timers consistently
- Advance time programmatically instead of waiting
- Group time-dependent tests to minimize setup/teardown overhead

## Best Practices Summary

1. **Always mock time** - Don't rely on real time in tests
2. **Clean up thoroughly** - Restore original time functions after tests
3. **Test edge cases** - Zero, negative, and large values
4. **Use deterministic values** - Fixed timestamps instead of current time
5. **Document time dependencies** - Make it clear when tests manipulate time
6. **Isolate tests** - Each test should start with a clean time state

By following these practices, we can create reliable, fast, and maintainable tests for time-dependent functionality.
