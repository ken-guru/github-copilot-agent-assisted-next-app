# Time Utilities Documentation

This document provides an overview of the unified time utilities available in the application.

## Overview

The time utilities are centralized in `src/utils/timeUtils.ts` and provide consistent functionality for formatting and converting time values. These utilities handle different time formats (milliseconds, seconds) and provide various output formats (HH:MM:SS, MM:SS, MM:SS.mmm).

## Available Functions

### Formatting Functions

| Function | Parameters | Return Value | Description |
|----------|------------|--------------|-------------|
| `formatTimeHuman` | milliseconds: number | string | Formats milliseconds into a human-readable string (H:MM:SS or M:SS) |
| `formatTime` | seconds: number | string | Formats seconds into a MM:SS format |
| `formatTimeWithMilliseconds` | milliseconds: number | string | Formats milliseconds into a MM:SS.mmm format with millisecond precision |
| `formatTimeFromMilliseconds` | milliseconds: number | string | Formats milliseconds into a MM:SS format |
| `formatTimeFromSeconds` | seconds: number | string | Formats seconds into a MM:SS format (alias for formatTime) |

### Conversion Functions

| Function | Parameters | Return Value | Description |
|----------|------------|--------------|-------------|
| `convertMillisecondsToSeconds` | milliseconds: number | number | Converts milliseconds to seconds (can include decimal points) |
| `convertSecondsToMilliseconds` | seconds: number | number | Converts seconds to milliseconds |

## Usage Examples

```typescript
import { 
  formatTimeHuman, 
  formatTime, 
  formatTimeWithMilliseconds, 
  convertMillisecondsToSeconds 
} from '@/utils/timeUtils';

// Format milliseconds into a human-readable time string
formatTimeHuman(3661000); // "1:01:01"
formatTimeHuman(185000);  // "3:05"
formatTimeHuman(3000);    // "0:03"

// Format seconds into MM:SS format
formatTime(65);  // "01:05"
formatTime(3600); // "60:00"

// Format with millisecond precision
formatTimeWithMilliseconds(60500); // "01:00.500"

// Convert between time units
convertMillisecondsToSeconds(1500); // 1.5
```

## Notes

- All formatting functions handle negative values by taking the absolute value.
- For backward compatibility, all functions are also available through the deprecated `time.ts` file, but it's recommended to import directly from `timeUtils.ts`.

## Best Practices

1. Always use the most specific function for your needs to make the code more readable.
2. When working with time values, be consistent with the units (milliseconds or seconds) throughout a component or feature.
3. Use the conversion functions when you need to switch between units to make the code more explicit.