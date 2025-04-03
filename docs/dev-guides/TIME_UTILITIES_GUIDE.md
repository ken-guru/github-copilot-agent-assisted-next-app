# Time Utilities Guide

This document provides guidance on using the time utilities in the application, as well as guidelines for maintaining and extending them.

## Overview

Our application has consolidated time-related utilities to avoid duplication and ensure consistent behavior. The utilities are organized as follows:

- **Production utilities**: Located in `/src/utils/timeUtils.ts`
- **Test utilities**: Located in `/src/utils/testUtils/timeUtils.ts`
- **Common utilities**: Shared functionality between production and test environments

## Using Time Utilities

### Basic Time Formatting

The primary time formatting function is `formatTime`, which supports multiple formats:

```typescript
import { formatTime } from '../utils/timeUtils';

// Format as MM:SS (default)
formatTime(65); // "01:05"

// Format as HH:MM:SS
formatTime(3665, { includeHours: true }); // "01:01:05"

// Format without leading zeros
formatTime(65, { padWithZeros: false }); // "1:05"
```

### Time Calculation Functions

```typescript
import { calcDuration, calcTimeLeft } from '../utils/timeUtils';

// Calculate duration between timestamps
const startTime = Date.now();
// ... some time later
const endTime = Date.now();
const durationInSeconds = calcDuration(startTime, endTime);

// Calculate time remaining
const totalDuration = 3600; // 1 hour in seconds
const elapsedTime = 1800; // 30 minutes in seconds
const timeLeft = calcTimeLeft(totalDuration, elapsedTime); // 1800
```

### For Testing Environments

When writing tests, use the test-specific utilities:

```typescript
import { formatTimeFromMs, createTimerMock } from '../utils/testUtils';

// Format time from milliseconds
formatTimeFromMs(65000); // "00:01:05"

// Mock timers in tests
const { advanceTime, clearAllTimers } = createTimerMock();
// Use in your test
advanceTime(1000); // Advance time by 1 second
// Clean up
clearAllTimers();
```

## Guidelines for Time Utility Maintenance

### Adding New Time Utilities

When adding new time-related functionality:

1. **Check existing utilities first** - There may already be a function that does what you need
2. **Place appropriately**:
   - General purpose formatting/calculation → `/src/utils/timeUtils.ts`
   - Test-specific helpers → `/src/utils/testUtils/timeUtils.ts`
3. **Follow naming conventions**:
   - Use descriptive names that indicate purpose (e.g., `formatTime`, `calcDuration`)
   - For similar functions with different behavior, use suffixes to disambiguate
4. **Document thoroughly**:
   - Use JSDoc comments with examples
   - Document parameters and return types
   - Include examples for different use cases
5. **Handle edge cases consistently**:
   - Negative values
   - Zero values
   - Extremely large values
   - Invalid inputs
6. **Add comprehensive tests**:
   - Basic functionality
   - Edge cases
   - Integration with components that will use it

### Testing Best Practices

1. **Isolate tests** - Each test should be independent and not rely on state from other tests
2. **Use fake timers** - For time-dependent tests, use Jest's fake timer functionality
3. **Test edge cases** - Ensure your utility works with all possible inputs
4. **Document test patterns** - Add comments explaining the test setup and assertions

## Rationale for the Current Structure

Our time utilities were consolidated to address several issues:

1. **Eliminate duplication** - We had multiple similar functions with slight variations
2. **Prevent circular dependencies** - The previous structure led to import cycles
3. **Improve developer experience** - Clear naming and documentation makes the utilities easier to use
4. **Ensure consistent behavior** - Unified implementation ensures consistent handling of edge cases

The separation between production and test utilities allows for specialized test helpers without bloating the production code.

## Review Process for Utility Changes

When making changes to utilities:

1. Submit a detailed proposal describing the change and its motivation
2. Include examples of how the new/modified utility will be used
3. Provide test cases demonstrating correct behavior
4. Get approval from at least one other developer before implementing
5. Update this documentation to reflect the changes

By following these guidelines, we can maintain clean, efficient, and well-documented time utilities throughout the application.
