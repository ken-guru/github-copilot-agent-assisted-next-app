# PWA Mobile Optimization Implementation Guide
## Complete Implementation Instructions for AI Coding Agents

**Document Version:** 1.0  
**Date:** February 13, 2026  
**Project:** Mr. Timely - Activity Tracking Application  
**Purpose:** Standalone guide for implementing Progressive Web App mobile optimizations

---

## 📋 Overview

This document provides complete, step-by-step instructions for optimizing the Mr. Timely Next.js web application for mobile Progressive Web App (PWA) users. This implementation improves the mobile experience without requiring app store deployment.

### What This Implementation Achieves

- ✅ Mobile-optimized Timeline visualization
- ✅ Bottom navigation bar for mobile devices
- ✅ Touch-optimized forms and inputs
- ✅ Gesture support (swipe, pull-to-refresh)
- ✅ Enhanced PWA installation experience
- ✅ Improved mobile performance
- ✅ Better offline UX
- ✅ Mobile-specific layout optimizations

### Current Application Context

**Tech Stack:**
- Next.js 16.1.6 (App Router with Turbopack)
- React 19.2.4
- TypeScript 5
- Bootstrap 5.3.8 + React Bootstrap 2.10.10
- PWA manifest and service worker already implemented

**Current PWA Features:**
- ✅ Manifest configured (`src/app/manifest.ts`)
- ✅ Service worker for offline support (`public/service-worker.js`)
- ✅ Responsive Bootstrap grid
- ✅ Mobile-collapsed navigation

**Current Limitations:**
- ❌ Timeline completely hidden on mobile (`d-none d-lg-flex`)
- ❌ Top navbar not optimized for mobile interaction
- ❌ Forms not optimized for mobile keyboards
- ❌ No gesture support
- ❌ No PWA install prompt
- ❌ Large bundle size (~1MB+)

### Success Metrics

After implementation:
- [ ] Mobile bounce rate < 40%
- [ ] Mobile page load time < 3 seconds
- [ ] Mobile users > 25% of total traffic
- [ ] Lighthouse mobile score > 90
- [ ] Positive user feedback on mobile UX

---

## 🎯 Implementation Phases

This implementation is divided into 5 phases to be completed over approximately **2 weeks** (80 development hours):

1. **Phase 1: Mobile Timeline** (20 hours) - Create mobile-optimized timeline view
2. **Phase 2: Bottom Navigation** (16 hours) - Add mobile-friendly navigation
3. **Phase 3: Form Optimization** (16 hours) - Mobile keyboard and input improvements
4. **Phase 4: Gestures & Interactions** (16 hours) - Touch gestures and swipe support
5. **Phase 5: Performance & PWA** (12 hours) - Bundle optimization and install prompt

---

## 📐 Phase 1: Mobile Timeline (20 hours)

### Goal
Create a mobile-optimized timeline view that displays activity progress in a compact, touch-friendly format.

### Current State

The timeline is completely hidden on mobile:
```typescript
// src/components/Timeline.tsx
<div className="col-lg-7 d-none d-lg-flex">
  <Timeline entries={timelineEntries} />
</div>
```

### Implementation Steps

#### Step 1.1: Create Mobile Timeline Component (6 hours)

**File:** `src/components/MobileTimeline.tsx`

```typescript
'use client';

import React from 'react';
import { Card } from 'react-bootstrap';
import type { TimelineEntry } from '@/types';

interface MobileTimelineProps {
  entries: TimelineEntry[];
  totalDuration: number;
  currentTime: number;
}

export const MobileTimeline: React.FC<MobileTimelineProps> = ({
  entries,
  totalDuration,
  currentTime,
}) => {
  // Calculate percentages for each entry
  const calculatePercentage = (startTime: number, endTime: number | null) => {
    const duration = (endTime || currentTime) - startTime;
    return (duration / totalDuration) * 100;
  };

  // Get activity name from entry
  const getActivityName = (entry: TimelineEntry) => {
    if (entry.activityId === null) return 'Break';
    // You'll need to pass activities data or look up by ID
    return entry.activityName || 'Activity';
  };

  return (
    <Card className="mobile-timeline-card mb-3">
      <Card.Header>
        <h6 className="mb-0">Timeline</h6>
      </Card.Header>
      <Card.Body className="p-2">
        <div className="mobile-timeline-container">
          {entries.length === 0 ? (
            <p className="text-muted text-center py-3 mb-0">
              No activities tracked yet
            </p>
          ) : (
            <div className="mobile-timeline-stack">
              {entries.map((entry, index) => {
                const percentage = calculatePercentage(
                  entry.startTime,
                  entry.endTime
                );
                const duration = ((entry.endTime || currentTime) - entry.startTime) / 1000 / 60;
                const isActive = entry.endTime === null;

                return (
                  <div
                    key={entry.id}
                    className={`mobile-timeline-entry ${isActive ? 'active' : ''}`}
                    style={{
                      backgroundColor: entry.colors.primary,
                      borderLeftColor: entry.colors.border,
                    }}
                  >
                    <div className="entry-content">
                      <div className="entry-header">
                        <span className="entry-name">
                          {getActivityName(entry)}
                        </span>
                        {isActive && (
                          <span className="badge bg-success">Running</span>
                        )}
                      </div>
                      <div className="entry-meta">
                        <span className="entry-duration">
                          {Math.round(duration)}min
                        </span>
                        <span className="entry-percentage">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    {isActive && (
                      <div className="entry-progress">
                        <div className="progress-pulse"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
```

**CSS Styles:** Add to `src/app/globals.css`

```css
/* Mobile Timeline Styles */
.mobile-timeline-card {
  display: none;
}

@media (max-width: 991.98px) {
  .mobile-timeline-card {
    display: block;
  }
}

.mobile-timeline-container {
  min-height: 100px;
}

.mobile-timeline-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-timeline-entry {
  border-radius: 8px;
  border-left-width: 4px;
  border-left-style: solid;
  padding: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.mobile-timeline-entry:active {
  transform: scale(0.98);
}

.mobile-timeline-entry.active {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  animation: pulse-shadow 2s infinite;
}

@keyframes pulse-shadow {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  50% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }
}

.entry-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.entry-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
}

.entry-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
}

.entry-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.progress-pulse {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 50%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent
  );
  animation: progress-pulse 2s ease-in-out infinite;
}

@keyframes progress-pulse {
  0% {
    left: -50%;
  }
  100% {
    left: 100%;
  }
}
```

#### Step 1.2: Create Collapsible Timeline Component (6 hours)

**File:** `src/components/CollapsibleTimeline.tsx`

```typescript
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
  currentTime,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="collapsible-timeline-wrapper d-lg-none">
      <Button
        variant="outline-primary"
        onClick={() => setIsOpen(!isOpen)}
        aria-controls="mobile-timeline-collapse"
        aria-expanded={isOpen}
        className="w-100 mb-2 d-flex justify-content-between align-items-center"
      >
        <span>
          {isOpen ? '▼' : '▶'} Timeline
          {entries.length > 0 && ` (${entries.length} entries)`}
        </span>
        <span className="text-muted small">
          {isOpen ? 'Hide' : 'Show'}
        </span>
      </Button>
      <Collapse in={isOpen}>
        <div id="mobile-timeline-collapse">
          <MobileTimeline
            entries={entries}
            totalDuration={totalDuration}
            currentTime={currentTime}
          />
        </div>
      </Collapse>
    </div>
  );
};
```

#### Step 1.3: Integrate Mobile Timeline (4 hours)

**File:** `src/app/page.tsx` (or wherever Timeline is used)

Modify the existing timeline rendering:

```typescript
// Find the existing timeline section
// FROM:
<div className="col-lg-7 d-none d-lg-flex">
  <Timeline entries={timelineEntries} />
</div>

// TO:
<>
  {/* Desktop Timeline (unchanged) */}
  <div className="col-lg-7 d-none d-lg-flex">
    <Timeline entries={timelineEntries} />
  </div>
  
  {/* Mobile Timeline (new) */}
  <div className="col-12 d-lg-none">
    <CollapsibleTimeline
      entries={timelineEntries}
      totalDuration={totalDuration}
      currentTime={currentTime}
    />
  </div>
</>
```

#### Step 1.4: Add Timeline Entry Tap Actions (4 hours)

Enhance `MobileTimeline.tsx` to support tap-to-view details:

```typescript
// Add to MobileTimeline component
const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

// In the entry rendering:
<div
  key={entry.id}
  className={`mobile-timeline-entry ${isActive ? 'active' : ''} ${
    selectedEntry === entry.id ? 'selected' : ''
  }`}
  onClick={() => setSelectedEntry(entry.id === selectedEntry ? null : entry.id)}
  style={{
    backgroundColor: entry.colors.primary,
    borderLeftColor: entry.colors.border,
  }}
>
  {/* existing content */}
  
  {selectedEntry === entry.id && (
    <div className="entry-details">
      <p className="mb-1">
        <strong>Started:</strong>{' '}
        {new Date(entry.startTime).toLocaleTimeString()}
      </p>
      {entry.endTime && (
        <p className="mb-0">
          <strong>Ended:</strong>{' '}
          {new Date(entry.endTime).toLocaleTimeString()}
        </p>
      )}
    </div>
  )}
</div>
```

Add CSS:
```css
.mobile-timeline-entry.selected {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.entry-details {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 12px;
  color: var(--text-secondary);
}
```

### Testing Phase 1

1. **Unit Tests:** Create `src/components/__tests__/MobileTimeline.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileTimeline } from '../MobileTimeline';

describe('MobileTimeline', () => {
  const mockEntries = [
    {
      id: '1',
      activityId: 'act1',
      activityName: 'Test Activity',
      startTime: Date.now() - 600000,
      endTime: Date.now(),
      colors: {
        primary: '#007bff',
        border: '#0056b3',
      },
    },
  ];

  it('renders timeline entries', () => {
    render(
      <MobileTimeline
        entries={mockEntries}
        totalDuration={600000}
        currentTime={Date.now()}
      />
    );
    expect(screen.getByText('Test Activity')).toBeInTheDocument();
  });

  it('shows empty state when no entries', () => {
    render(
      <MobileTimeline entries={[]} totalDuration={0} currentTime={Date.now()} />
    );
    expect(screen.getByText('No activities tracked yet')).toBeInTheDocument();
  });
});
```

2. **Manual Testing:**
   - Open app on mobile device or browser at 375px width
   - Verify timeline toggle button appears
   - Tap to expand timeline
   - Verify entries display correctly
   - Tap entries to see details
   - Verify active entry has pulse animation

---

## 📱 Phase 2: Bottom Navigation (16 hours)

### Goal
Create a mobile-optimized bottom navigation bar that replaces the top navbar on small screens.

### Implementation Steps

#### Step 2.1: Create Bottom Navigation Component (8 hours)

**File:** `src/components/BottomNavigation.tsx`

```typescript
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: string; // Bootstrap icon class
  badge?: number;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Timer', icon: 'bi-clock' },
  { href: '/activities', label: 'Activities', icon: 'bi-list-task' },
  { href: '/ai', label: 'AI', icon: 'bi-lightbulb' },
  { href: '/shared', label: 'Share', icon: 'bi-share' },
];

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className="bottom-navigation d-lg-none">
      <div className="bottom-nav-container">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`bottom-nav-item ${active ? 'active' : ''}`}
            >
              <i className={`${item.icon} bottom-nav-icon`}></i>
              <span className="bottom-nav-label">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bottom-nav-badge">{item.badge}</span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
```

**CSS Styles:** Add to `src/app/globals.css`

```css
/* Bottom Navigation Styles */
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  z-index: 1030;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  padding-bottom: env(safe-area-inset-bottom);
}

.bottom-nav-container {
  display: flex;
  justify-content: space-around;
  align-items: stretch;
  max-width: 600px;
  margin: 0 auto;
}

.bottom-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 4px;
  min-height: 56px;
  text-decoration: none;
  color: var(--text-secondary);
  position: relative;
  transition: all 0.2s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.bottom-nav-item:hover {
  color: var(--accent-color);
  background-color: rgba(0, 0, 0, 0.03);
}

.dark-mode .bottom-nav-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.bottom-nav-item.active {
  color: var(--accent-color);
}

.bottom-nav-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 3px;
  background: var(--accent-color);
  border-radius: 0 0 3px 3px;
}

.bottom-nav-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.bottom-nav-label {
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

.bottom-nav-badge {
  position: absolute;
  top: 4px;
  right: 50%;
  transform: translateX(10px);
  background: var(--error);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

/* Add padding to main content when bottom nav is present */
@media (max-width: 991.98px) {
  .main-content-wrapper {
    padding-bottom: calc(56px + env(safe-area-inset-bottom) + 16px);
  }
}
```

#### Step 2.2: Hide Top Navbar on Mobile (4 hours)

**File:** `src/components/Navigation.tsx`

Modify existing navigation to hide on mobile:

```typescript
// Add mobile-hide class to the top navigation
<Navbar className="d-none d-lg-flex" /* ... rest of props */>
  {/* existing navbar content */}
</Navbar>
```

If you need a minimal mobile header, create one:

```typescript
// Add above bottom nav
<header className="mobile-header d-lg-none">
  <div className="mobile-header-content">
    <h1 className="mobile-app-title">Mr. Timely</h1>
    <ThemeToggle />
  </div>
</header>
```

CSS:
```css
.mobile-header {
  position: sticky;
  top: 0;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 12px 16px;
  z-index: 1020;
}

.mobile-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-app-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}
```

#### Step 2.3: Integrate Bottom Navigation (4 hours)

**File:** `src/app/layout.tsx`

Add BottomNavigation to root layout:

```typescript
import { BottomNavigation } from '@/components/BottomNavigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {/* Top navigation for desktop */}
          <Navigation />
          
          {/* Main content */}
          <main className="main-content-wrapper">
            {children}
          </main>
          
          {/* Bottom navigation for mobile */}
          <BottomNavigation />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Testing Phase 2

1. **Unit Tests:** `src/components/__tests__/BottomNavigation.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { BottomNavigation } from '../BottomNavigation';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('BottomNavigation', () => {
  it('renders all navigation items', () => {
    render(<BottomNavigation />);
    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Activities')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('highlights active route', () => {
    render(<BottomNavigation />);
    const timerItem = screen.getByText('Timer').closest('.bottom-nav-item');
    expect(timerItem).toHaveClass('active');
  });
});
```

2. **Manual Testing:**
   - Resize browser to 375px width
   - Verify bottom nav appears
   - Verify top navbar hidden
   - Tap each nav item
   - Verify navigation works
   - Verify active state highlights
   - Test in portrait and landscape

---

## 📝 Phase 3: Form Optimization (16 hours)

### Goal
Optimize all form inputs for mobile keyboards and touch interaction.

### Implementation Steps

#### Step 3.1: Create Mobile-Optimized Form Components (8 hours)

**File:** `src/components/forms/MobileOptimizedInput.tsx`

```typescript
'use client';

import React, { forwardRef } from 'react';
import { Form } from 'react-bootstrap';

interface MobileOptimizedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  inputMode?: 'text' | 'decimal' | 'numeric' | 'tel' | 'email' | 'url';
}

export const MobileOptimizedInput = forwardRef<
  HTMLInputElement,
  MobileOptimizedInputProps
>(({ label, error, helpText, inputMode, ...props }, ref) => {
  return (
    <Form.Group className="mobile-form-group">
      {label && <Form.Label className="mobile-form-label">{label}</Form.Label>}
      <Form.Control
        ref={ref}
        className="mobile-form-input"
        isInvalid={!!error}
        inputMode={inputMode}
        {...props}
      />
      {helpText && (
        <Form.Text className="mobile-form-help">{helpText}</Form.Text>
      )}
      {error && (
        <Form.Control.Feedback type="invalid" className="mobile-form-error">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
});

MobileOptimizedInput.displayName = 'MobileOptimizedInput';
```

**CSS Styles:**

```css
/* Mobile Form Styles */
@media (max-width: 767.98px) {
  .mobile-form-group {
    margin-bottom: 20px;
  }

  .mobile-form-label {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-primary);
  }

  .mobile-form-input {
    font-size: 16px !important; /* Prevents zoom on iOS */
    padding: 12px 16px;
    border-radius: 8px;
    min-height: 48px; /* Touch-friendly height */
  }

  .mobile-form-input:focus {
    border-width: 2px;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
  }

  .mobile-form-help {
    font-size: 12px;
    margin-top: 6px;
    display: block;
  }

  .mobile-form-error {
    font-size: 13px;
    margin-top: 6px;
  }

  /* Larger tap targets for checkboxes and radios */
  .form-check-input {
    width: 20px;
    height: 20px;
    margin-top: 0;
  }

  .form-check-label {
    padding-left: 8px;
    font-size: 15px;
    line-height: 20px;
  }

  /* Larger buttons */
  .btn {
    min-height: 48px;
    font-size: 16px;
    padding: 12px 24px;
  }

  .btn-lg {
    min-height: 56px;
    font-size: 18px;
  }
}
```

#### Step 3.2: Optimize Activity Form (4 hours)

**File:** `src/app/activities/page.tsx` (or wherever activity forms are)

Update activity input fields:

```typescript
// Replace existing Form.Control with MobileOptimizedInput
<MobileOptimizedInput
  type="text"
  placeholder="Activity name"
  value={activityName}
  onChange={(e) => setActivityName(e.target.value)}
  label="Activity Name"
  inputMode="text"
  autoComplete="off"
  maxLength={50}
/>

<MobileOptimizedInput
  type="number"
  placeholder="Duration (minutes)"
  value={duration}
  onChange={(e) => setDuration(e.target.value)}
  label="Duration"
  inputMode="numeric"
  pattern="[0-9]*"
  min="1"
  max="999"
/>
```

#### Step 3.3: Add Input Accessories (4 hours)

Create quick-input buttons for common values:

```typescript
// File: src/components/forms/DurationQuickPick.tsx
'use client';

import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

interface DurationQuickPickProps {
  onSelect: (minutes: number) => void;
  selectedValue?: number;
}

const commonDurations = [15, 25, 30, 45, 60, 90];

export const DurationQuickPick: React.FC<DurationQuickPickProps> = ({
  onSelect,
  selectedValue,
}) => {
  return (
    <div className="duration-quick-pick">
      <p className="quick-pick-label">Quick select:</p>
      <ButtonGroup className="quick-pick-buttons">
        {commonDurations.map((duration) => (
          <Button
            key={duration}
            variant={selectedValue === duration ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => onSelect(duration)}
          >
            {duration}min
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};
```

CSS:
```css
.duration-quick-pick {
  margin-bottom: 16px;
}

.quick-pick-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.quick-pick-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-pick-buttons .btn {
  min-height: 36px;
  padding: 6px 12px;
  font-size: 14px;
}
```

### Testing Phase 3

1. **Manual Testing:**
   - Open forms on mobile device
   - Verify font-size is 16px (no zoom on iOS)
   - Verify proper keyboard types appear (numeric for numbers, etc.)
   - Verify tap targets are at least 44x44px
   - Test quick-pick buttons
   - Verify form validation displays correctly
   - Test in portrait and landscape

---

## 👆 Phase 4: Gestures & Interactions (16 hours)

### Goal
Add touch gestures and mobile-specific interactions for better UX.

### Implementation Steps

#### Step 4.1: Install Touch Gesture Library (2 hours)

```bash
npm install react-swipeable
```

#### Step 4.2: Add Swipe to Delete (6 hours)

**File:** `src/components/SwipeableActivityCard.tsx`

```typescript
'use client';

import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Card, Button } from 'react-bootstrap';

interface SwipeableActivityCardProps {
  activity: Activity;
  onDelete: () => void;
  onEdit: () => void;
  children: React.ReactNode;
}

export const SwipeableActivityCard: React.FC<SwipeableActivityCardProps> = ({
  activity,
  onDelete,
  onEdit,
  children,
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      setIsSwiping(true);
      // Only allow left swipe
      if (eventData.deltaX < 0) {
        setSwipeOffset(Math.max(eventData.deltaX, -120));
      }
    },
    onSwipedLeft: () => {
      setSwipeOffset(-120);
      setIsSwiping(false);
    },
    onSwipedRight: () => {
      setSwipeOffset(0);
      setIsSwiping(false);
    },
    onTap: () => {
      if (swipeOffset !== 0) {
        setSwipeOffset(0);
      }
    },
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  return (
    <div className="swipeable-card-wrapper">
      <div
        {...handlers}
        className={`swipeable-card-content ${isSwiping ? 'swiping' : ''}`}
        style={{
          transform: `translateX(${swipeOffset}px)`,
        }}
      >
        {children}
      </div>
      <div className="swipeable-card-actions">
        <Button
          variant="warning"
          size="sm"
          className="swipe-action-btn"
          onClick={onEdit}
        >
          <i className="bi-pencil"></i>
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          className="swipe-action-btn"
          onClick={onDelete}
        >
          <i className="bi-trash"></i>
          Delete
        </Button>
      </div>
    </div>
  );
};
```

**CSS:**

```css
.swipeable-card-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.swipeable-card-content {
  position: relative;
  z-index: 2;
  background: var(--bg-primary);
  transition: transform 0.3s ease;
  will-change: transform;
}

.swipeable-card-content.swiping {
  transition: none;
}

.swipeable-card-actions {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  z-index: 1;
}

.swipe-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  min-width: 60px;
  font-size: 11px;
}

.swipe-action-btn i {
  font-size: 18px;
}
```

#### Step 4.3: Add Pull to Refresh (4 hours)

**File:** `src/components/PullToRefresh.tsx`

```typescript
'use client';

import React, { useState, useRef, useEffect } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - startY.current;
      
      if (distance > 0) {
        setPullDistance(Math.min(distance * 0.5, 80));
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 60 && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(60);
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  };

  return (
    <div
      ref={containerRef}
      className="pull-to-refresh-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="pull-to-refresh-indicator"
        style={{
          height: `${pullDistance}px`,
          opacity: pullDistance / 60,
        }}
      >
        <div className={`refresh-spinner ${isRefreshing ? 'spinning' : ''}`}>
          <i className="bi-arrow-clockwise"></i>
        </div>
        <p className="refresh-text">
          {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
        </p>
      </div>
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isRefreshing ? 'none' : 'transform 0.3s ease',
        }}
      >
        {children}
      </div>
    </div>
  );
};
```

**CSS:**

```css
.pull-to-refresh-container {
  overflow: hidden;
}

.pull-to-refresh-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: height 0.3s ease, opacity 0.3s ease;
}

.refresh-spinner {
  font-size: 24px;
  color: var(--accent-color);
  transition: transform 0.3s ease;
}

.refresh-spinner.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.refresh-text {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 4px 0 0;
}
```

#### Step 4.4: Add Haptic Feedback (4 hours)

**File:** `src/utils/haptics.ts`

```typescript
/**
 * Provides haptic feedback on mobile devices
 */
export class HapticFeedback {
  private static isSupported(): boolean {
    return 'vibrate' in navigator;
  }

  static light(): void {
    if (this.isSupported()) {
      navigator.vibrate(10);
    }
  }

  static medium(): void {
    if (this.isSupported()) {
      navigator.vibrate(20);
    }
  }

  static heavy(): void {
    if (this.isSupported()) {
      navigator.vibrate([30, 10, 30]);
    }
  }

  static success(): void {
    if (this.isSupported()) {
      navigator.vibrate([10, 50, 10]);
    }
  }

  static error(): void {
    if (this.isSupported()) {
      navigator.vibrate([20, 100, 20, 100, 20]);
    }
  }

  static selection(): void {
    if (this.isSupported()) {
      navigator.vibrate(5);
    }
  }
}
```

**Usage Example:**

```typescript
import { HapticFeedback } from '@/utils/haptics';

// In button onClick
const handleStartActivity = () => {
  HapticFeedback.light();
  startActivity();
};

// On successful action
const handleSaveActivity = async () => {
  try {
    await saveActivity();
    HapticFeedback.success();
  } catch (error) {
    HapticFeedback.error();
  }
};

// On selection change
const handleActivitySelect = (id: string) => {
  HapticFeedback.selection();
  selectActivity(id);
};
```

### Testing Phase 4

1. **Manual Testing:**
   - Test swipe to delete on activity cards
   - Verify swipe reveals action buttons
   - Test pull to refresh on main page
   - Verify haptic feedback on supported devices
   - Test gesture conflicts with browser navigation
   - Test in iOS Safari and Chrome Android

---

## ⚡ Phase 5: Performance & PWA (12 hours)

### Goal
Optimize bundle size, improve performance, and enhance PWA installation experience.

### Implementation Steps

#### Step 5.1: Code Splitting (4 hours)

**File:** `next.config.mjs`

Add webpack optimizations:

```javascript
const nextConfig = {
  // ... existing config
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Split vendor chunks
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Bootstrap chunk
            bootstrap: {
              name: 'bootstrap',
              test: /[\\/]node_modules[\\/](bootstrap|react-bootstrap)[\\/]/,
              priority: 40,
            },
            // React chunk
            react: {
              name: 'react',
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              priority: 50,
            },
            // Common components
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
```

**Lazy Load Heavy Components:**

```typescript
// Instead of:
// import { Timeline } from '@/components/Timeline';

// Use:
import dynamic from 'next/dynamic';

const Timeline = dynamic(() => import('@/components/Timeline').then(mod => ({ default: mod.Timeline })), {
  loading: () => <div>Loading timeline...</div>,
  ssr: false,
});

const MobileTimeline = dynamic(() => import('@/components/MobileTimeline').then(mod => ({ default: mod.MobileTimeline })), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});
```

#### Step 5.2: Add PWA Install Prompt (4 hours)

**File:** `src/components/PWAInstallPrompt.tsx`

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt only after user has used app for a bit
      setTimeout(() => {
        const installDismissed = localStorage.getItem('pwa-install-dismissed');
        if (!installDismissed) {
          setShowPrompt(true);
        }
      }, 30000); // 30 seconds
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <Alert
      variant="info"
      dismissible
      onClose={handleDismiss}
      className="pwa-install-prompt"
    >
      <Alert.Heading>Install Mr. Timely</Alert.Heading>
      <p>
        Install our app for quick access and a better experience!
      </p>
      <div className="d-flex gap-2">
        <Button variant="primary" size="sm" onClick={handleInstall}>
          Install
        </Button>
        <Button variant="outline-secondary" size="sm" onClick={handleDismiss}>
          Not now
        </Button>
      </div>
    </Alert>
  );
};
```

**CSS:**

```css
.pwa-install-prompt {
  position: fixed;
  bottom: calc(56px + env(safe-area-inset-bottom) + 16px);
  left: 16px;
  right: 16px;
  z-index: 1040;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  margin: 0 auto;
}

@media (min-width: 992px) {
  .pwa-install-prompt {
    bottom: 16px;
  }
}
```

Add to layout:

```typescript
// src/app/layout.tsx
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Navigation />
          <main className="main-content-wrapper">
            {children}
          </main>
          <BottomNavigation />
          <PWAInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### Step 5.3: Optimize Service Worker (2 hours)

**File:** `public/service-worker.js`

Add strategy for mobile-specific resources:

```javascript
// Add to existing service worker

// Cache mobile-specific assets
const MOBILE_CACHE = 'mobile-assets-v1';
const mobileAssets = [
  '/mobile-timeline.js',
  '/mobile-nav.js',
  // Add other mobile-specific resources
];

// Install mobile cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(MOBILE_CACHE).then((cache) => {
      return cache.addAll(mobileAssets);
    })
  );
});

// Add network-first strategy for API calls
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network-first for API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(MOBILE_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache
          return caches.match(request);
        })
    );
    return;
  }

  // Default cache-first for other resources
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request);
    })
  );
});
```

#### Step 5.4: Performance Monitoring (2 hours)

**File:** `src/utils/performance.ts`

```typescript
/**
 * Monitors and reports web vitals
 */
export const reportWebVitals = (metric: any) => {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    const { name, value, id } = metric;
    
    // Send to your analytics service
    // Example with Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', name, {
        event_category: 'Web Vitals',
        event_label: id,
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        non_interaction: true,
      });
    }
  }
};
```

**File:** `src/app/layout.tsx`

```typescript
import { reportWebVitals } from '@/utils/performance';

// Export from layout
export { reportWebVitals };
```

### Testing Phase 5

1. **Performance Testing:**
   ```bash
   # Build production
   npm run build
   
   # Analyze bundle
   npm run analyze  # Add script to package.json if needed
   ```

2. **Lighthouse Testing:**
   - Run Lighthouse on mobile
   - Target scores:
     - Performance: > 90
     - Accessibility: > 95
     - Best Practices: > 95
     - SEO: > 90
     - PWA: 100

3. **Manual Testing:**
   - Test PWA install prompt appears
   - Install app and verify it works standalone
   - Test offline functionality
   - Verify service worker caching
   - Check bundle size (should be < 500KB initial)

---

## 🧪 Final Testing & Validation

### Complete Testing Checklist

#### Functional Testing
- [ ] Mobile timeline displays correctly
- [ ] Bottom navigation works on all pages
- [ ] Forms use correct input types
- [ ] Swipe gestures work smoothly
- [ ] Pull to refresh functions
- [ ] Haptic feedback triggers
- [ ] PWA install prompt appears
- [ ] All features work offline

#### Visual Testing
- [ ] Test on iPhone SE (375px width)
- [ ] Test on iPhone 12 Pro (390px width)
- [ ] Test on Pixel 5 (393px width)
- [ ] Test on iPad (768px width)
- [ ] Verify safe area insets on iPhone with notch
- [ ] Check dark mode on all screens
- [ ] Verify touch targets ≥ 44x44px

#### Performance Testing
- [ ] Lighthouse mobile score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Total bundle size < 500KB
- [ ] No layout shifts (CLS < 0.1)

#### Browser Testing
- [ ] iOS Safari (iOS 15+)
- [ ] Chrome Android (latest)
- [ ] Samsung Internet
- [ ] Firefox Mobile

---

## 📦 Deployment

### Pre-Deployment Checklist

1. **Code Quality:**
   ```bash
   npm run lint
   npm run type-check
   npm test
   ```

2. **Build Verification:**
   ```bash
   npm run build
   npm run start
   ```

3. **Performance Check:**
   - Run Lighthouse
   - Check bundle sizes
   - Verify service worker updates

### Deployment Steps

1. **Commit Changes:**
   ```bash
   git add .
   git commit -m "feat: add PWA mobile optimizations"
   git push
   ```

2. **Deploy to Production:**
   - Vercel/Netlify will auto-deploy
   - Monitor deployment logs
   - Verify live site

3. **Post-Deployment:**
   - Test on real mobile devices
   - Monitor analytics
   - Watch for errors in monitoring tools

---

## 📊 Success Metrics

Monitor these metrics after deployment:

### User Engagement
- **Target:** Mobile users > 25% of total
- **Measure:** Google Analytics or Vercel Analytics
- **Timeline:** 2 weeks after deployment

### Performance
- **Target:** Mobile bounce rate < 40%
- **Measure:** Google Analytics
- **Timeline:** 1 week after deployment

### PWA Installation
- **Target:** 5% of mobile users install PWA
- **Measure:** PWA installation events
- **Timeline:** 4 weeks after deployment

### Page Speed
- **Target:** Load time < 3 seconds on 3G
- **Measure:** Lighthouse, Web Vitals
- **Timeline:** Immediate

---

## 🔧 Troubleshooting

### Common Issues

#### Issue: Bottom nav overlaps content

**Solution:**
```css
/* Ensure main content has bottom padding */
.main-content-wrapper {
  padding-bottom: calc(56px + env(safe-area-inset-bottom) + 16px);
}
```

#### Issue: Forms zoom on iOS

**Solution:**
```css
/* Input font-size must be 16px or larger */
.mobile-form-input {
  font-size: 16px !important;
}
```

#### Issue: Swipe conflicts with browser back gesture

**Solution:**
```typescript
// In swipeable handler
preventScrollOnSwipe: true,
delta: 50, // Require larger swipe distance
```

#### Issue: PWA install prompt doesn't appear

**Solution:**
- Check HTTPS is enabled
- Verify manifest.json is valid
- Check service worker is registered
- Clear browser cache
- Test in incognito mode

---

## 📚 Additional Resources

### Documentation
- [Next.js Mobile Optimization](https://nextjs.org/docs/pages/building-your-application/optimizing)
- [PWA Best Practices](https://web.dev/pwa-checklist/)
- [Mobile Web Best Practices](https://developer.mozilla.org/en-US/docs/Web/Guide/Mobile)
- [Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [BrowserStack](https://www.browserstack.com/) - Cross-device testing
- [Chrome DevTools Device Mode](https://developer.chrome.com/docs/devtools/device-mode/)

---

## ✅ Completion Criteria

This implementation is complete when:

- [ ] All 5 phases implemented and tested
- [ ] All tests passing (unit + integration)
- [ ] Lighthouse mobile score > 90
- [ ] Manual testing on real devices successful
- [ ] Code reviewed and approved
- [ ] Deployed to production
- [ ] Documentation updated
- [ ] Team trained on new features

---

## 📝 Notes for AI Coding Agents

### Implementation Order
1. Start with Phase 1 (Mobile Timeline) - most visible improvement
2. Then Phase 2 (Bottom Navigation) - enables easy navigation
3. Then Phase 3 (Forms) - improves data entry
4. Then Phase 4 (Gestures) - adds polish
5. Finally Phase 5 (Performance) - ensures fast experience

### Code Style Guidelines
- Use TypeScript strict mode
- Follow existing component patterns
- Use Bootstrap utilities where possible
- Add PropTypes for all components
- Write tests for all new components
- Use meaningful variable names
- Add comments for complex logic

### Testing Requirements
- Unit tests for all components
- Integration tests for user flows
- Manual testing on real devices required
- Lighthouse audit before deployment
- Cross-browser testing mandatory

### Performance Budget
- Initial bundle: < 500KB
- Route bundles: < 200KB each
- Images: < 100KB each (use WebP)
- Fonts: < 50KB total
- Total page size: < 1MB

---

**End of PWA Optimization Implementation Guide**

This document provides complete instructions for implementing mobile PWA optimizations. Follow each phase sequentially, test thoroughly, and monitor metrics after deployment.
