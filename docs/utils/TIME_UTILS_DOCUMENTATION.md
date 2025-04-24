# Time Utilities Documentation

## Navigation
- [Overview](#overview)
- [Module Structure](#module-structure)
- [API Reference](#api-reference)
- [Migration Guide](#migration-guide)
- [Example Usage](#example-usage)

## Overview

The Time Utilities module provides functions for formatting time values, calculating durations, and converting between time units. It has been refactored into a modular structure to improve maintainability and organization.

## Module Structure

The module is organized into the following files:

- `types.ts` - Contains shared type definitions
- `timeFormatters.ts` - Functions for formatting time values
- `timeConversions.ts` - Functions for converting between time units
- `timeDurations.ts` - Functions for calculating durations
- `index.ts` - Barrel file that re-exports all functions and types

## API Reference

### Types

```typescript
type TimeFormatOptions = {
  includeHours?: boolean; // Include hours in the formatted output (default: false)
  padWithZeros?: boolean; // Pad numbers with leading zeros (default: true)
};
```

### Formatters

```typescript
function formatTime(seconds: number, options?: TimeFormatOptions): string
```
Formats a time in seconds to a string format (MM:SS or HH:MM:SS based on options).

```typescript
function formatTimeMMSS(seconds: number): string
```
Deprecated: Formats a time in seconds to a MM:SS format. Use `formatTime` instead.

### Conversions

```typescript
function formatTimeFromMs(milliseconds: number, options?: TimeFormatOptions): string
```
Formats milliseconds to a formatted time string.

### Durations

```typescript
function calculateDurationInSeconds(startTime: number, endTime: number): number
```
Calculates the duration in seconds between two timestamps.

## Migration Guide

If you're importing from the deprecated `timeUtils.ts` file:

```typescript
import { formatTime, formatTimeFromMs } from '../utils/timeUtils';
```

You should update your imports to use the new structure:

```typescript
import { formatTime } from '../utils/time/timeFormatters';
import { formatTimeFromMs } from '../utils/time/timeConversions';
```

Or, for convenience, you can import from the barrel file:

```typescript
import { formatTime, formatTimeFromMs } from '../utils/time';
```

## Example Usage

### Formatting Seconds

```typescript
import { formatTime } from '../utils/time/timeFormatters';

// Format to MM:SS
formatTime(65); // "01:05"

// Format to HH:MM:SS
formatTime(3661, { includeHours: true }); // "01:01:01"

// Without zero padding for minutes/hours
formatTime(65, { padWithZeros: false }); // "1:05"
```

### Converting Milliseconds to Formatted Time

```typescript
import { formatTimeFromMs } from '../utils/time/timeConversions';

// Format milliseconds to MM:SS
formatTimeFromMs(65000); // "01:05"

// Format milliseconds to HH:MM:SS
formatTimeFromMs(3661000, { includeHours: true }); // "01:01:01"
```

### Calculating Durations

```typescript
import { calculateDurationInSeconds } from '../utils/time/timeDurations';

// Calculate duration between two timestamps
const startTime = Date.now();
// ... some operations ...
const endTime = Date.now();
const durationInSeconds = calculateDurationInSeconds(startTime, endTime);
```
