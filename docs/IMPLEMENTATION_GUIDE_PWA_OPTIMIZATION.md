# PWA Mobile Optimization - Implementation Guide
**AI Coding Agent Instructions | Version 1.1 | Target: <30,000 chars**

## Overview
Optimize Mr. Timely Next.js app for mobile PWA users. **Timeline:** 2 weeks (80h) | **Cost:** $8K

**Current Stack:** Next.js 16.1.6, React 19.2.4, TypeScript 5, Bootstrap 5.3.8
**Goal:** Mobile timeline, bottom nav, touch forms, gestures, PWA prompt, performance

## Phase 1: Mobile Timeline (20h)

### 1.1 Create MobileTimeline Component
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

export const MobileTimeline: React.FC<MobileTimelineProps> = ({ entries, totalDuration, currentTime }) => {
  const calcPercent = (start: number, end: number | null) => 
    ((end || currentTime) - start) / totalDuration * 100;

  return (
    <Card className="mobile-timeline-card mb-3">
      <Card.Header><h6 className="mb-0">Timeline</h6></Card.Header>
      <Card.Body className="p-2">
        {entries.length === 0 ? (
          <p className="text-muted text-center py-3 mb-0">No activities tracked yet</p>
        ) : (
          <div className="mobile-timeline-stack">
            {entries.map(entry => {
              const percent = calcPercent(entry.startTime, entry.endTime);
              const duration = ((entry.endTime || currentTime) - entry.startTime) / 60000;
              return (
                <div key={entry.id} className="mobile-timeline-entry"
                     style={{ backgroundColor: entry.colors.primary, borderLeftColor: entry.colors.border }}>
                  <div className="entry-header">
                    <span className="entry-name">{entry.activityName || 'Break'}</span>
                    {!entry.endTime && <span className="badge bg-success">Running</span>}
                  </div>
                  <div className="entry-meta">
                    <span>{Math.round(duration)}min</span>
                    <span>{percent.toFixed(1)}%</span>
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
```

**CSS:** `src/app/globals.css`
```css
.mobile-timeline-card { display: none; }
@media (max-width: 991.98px) { .mobile-timeline-card { display: block; } }
.mobile-timeline-stack { display: flex; flex-direction: column; gap: 8px; }
.mobile-timeline-entry {
  border-radius: 8px; border-left-width: 4px; border-left-style: solid;
  padding: 12px; transition: transform 0.2s; position: relative;
}
.mobile-timeline-entry:active { transform: scale(0.98); }
.mobile-timeline-entry.active { animation: pulse-shadow 2s infinite; }
@keyframes pulse-shadow {
  0%, 100% { box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
  50% { box-shadow: 0 4px 12px rgba(0,0,0,0.25); }
}
.entry-header { display: flex; justify-content: space-between; align-items: center; }
.entry-name { font-weight: 600; font-size: 14px; }
.entry-meta { display: flex; justify-content: space-between; font-size: 12px; }
```

### 1.2 CollapsibleTimeline
**File:** `src/components/CollapsibleTimeline.tsx`

```typescript
'use client';
import React, { useState } from 'react';
import { Collapse, Button } from 'react-bootstrap';
import { MobileTimeline } from './MobileTimeline';

export const CollapsibleTimeline = ({ entries, totalDuration, currentTime }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="d-lg-none">
      <Button variant="outline-primary" onClick={() => setIsOpen(!isOpen)} className="w-100 mb-2">
        {isOpen ? '▼' : '▶'} Timeline {entries.length > 0 && `(${entries.length})`}
      </Button>
      <Collapse in={isOpen}>
        <div><MobileTimeline entries={entries} totalDuration={totalDuration} currentTime={currentTime} /></div>
      </Collapse>
    </div>
  );
};
```

### 1.3 Integration
**File:** `src/app/page.tsx` - Add below desktop timeline:
```typescript
<div className="col-12 d-lg-none">
  <CollapsibleTimeline entries={timelineEntries} totalDuration={totalDuration} currentTime={currentTime} />
</div>
```

## Phase 2: Bottom Navigation (16h)

### 2.1 BottomNavigation Component
**File:** `src/components/BottomNavigation.tsx`

```typescript
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Timer', icon: 'bi-clock' },
  { href: '/activities', label: 'Activities', icon: 'bi-list-task' },
  { href: '/ai', label: 'AI', icon: 'bi-lightbulb' },
];

export const BottomNavigation = () => {
  const pathname = usePathname();
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <nav className="bottom-navigation d-lg-none">
      <div className="bottom-nav-container">
        {navItems.map(item => (
          <Link key={item.href} href={item.href} className={`bottom-nav-item ${isActive(item.href) ? 'active' : ''}`}>
            <i className={`${item.icon} bottom-nav-icon`}></i>
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
```

**CSS:**
```css
.bottom-navigation {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: var(--bg-primary); border-top: 1px solid var(--border-color);
  z-index: 1030; box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  padding-bottom: env(safe-area-inset-bottom);
}
.bottom-nav-container { display: flex; justify-content: space-around; max-width: 600px; margin: 0 auto; }
.bottom-nav-item {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  padding: 8px 4px; min-height: 56px; text-decoration: none;
  color: var(--text-secondary); transition: all 0.2s;
}
.bottom-nav-item.active { color: var(--accent-color); }
.bottom-nav-item.active::before {
  content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 32px; height: 3px; background: var(--accent-color); border-radius: 0 0 3px 3px;
}
.bottom-nav-icon { font-size: 20px; margin-bottom: 4px; }
.bottom-nav-label { font-size: 11px; font-weight: 500; }
@media (max-width: 991.98px) {
  .main-content-wrapper { padding-bottom: calc(56px + env(safe-area-inset-bottom) + 16px); }
}
```

### 2.2 Hide Top Nav on Mobile
**File:** `src/components/Navigation.tsx` - Add class: `d-none d-lg-flex`

### 2.3 Integration
**File:** `src/app/layout.tsx`
```typescript
import { BottomNavigation } from '@/components/BottomNavigation';

export default function RootLayout({ children }) {
  return (
    <html><body>
      <Navigation />
      <main className="main-content-wrapper">{children}</main>
      <BottomNavigation />
    </body></html>
  );
}
```

## Phase 3: Form Optimization (16h)

### 3.1 MobileOptimizedInput
**File:** `src/components/forms/MobileOptimizedInput.tsx`

```typescript
'use client';
import React, { forwardRef } from 'react';
import { Form } from 'react-bootstrap';

interface MobileOptimizedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  inputMode?: 'text' | 'decimal' | 'numeric' | 'tel' | 'email';
}

export const MobileOptimizedInput = forwardRef<HTMLInputElement, MobileOptimizedInputProps>(
  ({ label, error, inputMode, ...props }, ref) => (
    <Form.Group className="mobile-form-group">
      {label && <Form.Label className="mobile-form-label">{label}</Form.Label>}
      <Form.Control ref={ref} className="mobile-form-input" isInvalid={!!error} inputMode={inputMode} {...props} />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  )
);
```

**CSS:**
```css
@media (max-width: 767.98px) {
  .mobile-form-input {
    font-size: 16px !important; /* Prevents iOS zoom */
    padding: 12px 16px; border-radius: 8px; min-height: 48px;
  }
  .btn { min-height: 48px; font-size: 16px; }
}
```

### 3.2 Use in Forms
Replace `Form.Control` with:
```typescript
<MobileOptimizedInput
  type="text"
  placeholder="Activity name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  inputMode="text"
/>

<MobileOptimizedInput
  type="number"
  placeholder="Duration"
  inputMode="numeric"
  pattern="[0-9]*"
/>
```

## Phase 4: Gestures (16h)

### 4.1 Install Dependencies
```bash
npm install react-swipeable
```

### 4.2 SwipeableCard
**File:** `src/components/SwipeableActivityCard.tsx`

```typescript
'use client';
import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Button } from 'react-bootstrap';

export const SwipeableActivityCard = ({ activity, onDelete, children }) => {
  const [offset, setOffset] = useState(0);
  
  const handlers = useSwipeable({
    onSwiping: (e) => e.deltaX < 0 && setOffset(Math.max(e.deltaX, -120)),
    onSwipedLeft: () => setOffset(-120),
    onSwipedRight: () => setOffset(0),
    preventScrollOnSwipe: true,
  });

  return (
    <div className="swipeable-wrapper">
      <div {...handlers} className="swipeable-content" style={{ transform: `translateX(${offset}px)` }}>
        {children}
      </div>
      <div className="swipeable-actions">
        <Button variant="danger" size="sm" onClick={onDelete}>Delete</Button>
      </div>
    </div>
  );
};
```

**CSS:**
```css
.swipeable-wrapper { position: relative; overflow: hidden; }
.swipeable-content { transition: transform 0.3s; background: var(--bg-primary); }
.swipeable-actions {
  position: absolute; top: 0; right: 0; bottom: 0;
  display: flex; align-items: center; padding: 0 12px;
}
```

### 4.3 Haptics
**File:** `src/utils/haptics.ts`

```typescript
export class HapticFeedback {
  static light() { navigator.vibrate?.(10); }
  static success() { navigator.vibrate?.([10, 50, 10]); }
  static error() { navigator.vibrate?.([20, 100, 20]); }
}
```

**Usage:**
```typescript
import { HapticFeedback } from '@/utils/haptics';

onClick={() => {
  HapticFeedback.light();
  handleAction();
}}
```

## Phase 5: Performance & PWA (12h)

### 5.1 Code Splitting
**File:** `next.config.mjs`

```javascript
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          bootstrap: { name: 'bootstrap', test: /[\\/]node_modules[\\/](bootstrap|react-bootstrap)[\\/]/, priority: 40 },
          react: { name: 'react', test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/, priority: 50 },
        },
      };
    }
    return config;
  },
};
```

**Lazy Load Components:**
```typescript
import dynamic from 'next/dynamic';

const Timeline = dynamic(() => import('@/components/Timeline'), { ssr: false });
const MobileTimeline = dynamic(() => import('@/components/MobileTimeline'), { ssr: false });
```

### 5.2 PWA Install Prompt
**File:** `src/components/PWAInstallPrompt.tsx`

```typescript
'use client';
import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';

export const PWAInstallPrompt = () => {
  const [prompt, setPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
      setTimeout(() => {
        if (!localStorage.getItem('pwa-dismissed')) setShow(true);
      }, 30000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    await prompt.prompt();
    setPrompt(null);
    setShow(false);
  };

  if (!show) return null;

  return (
    <Alert variant="info" dismissible onClose={() => { setShow(false); localStorage.setItem('pwa-dismissed', 'true'); }}
           className="pwa-prompt">
      <Alert.Heading>Install Mr. Timely</Alert.Heading>
      <Button variant="primary" size="sm" onClick={handleInstall}>Install</Button>
    </Alert>
  );
};
```

**CSS:**
```css
.pwa-prompt {
  position: fixed; bottom: 72px; left: 16px; right: 16px;
  z-index: 1040; max-width: 400px; margin: 0 auto;
}
```

**Add to Layout:**
```typescript
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
// Add after BottomNavigation
<PWAInstallPrompt />
```

## Testing

### Unit Tests
**File:** `src/components/__tests__/MobileTimeline.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { MobileTimeline } from '../MobileTimeline';

test('renders timeline entries', () => {
  const entries = [{ id: '1', activityName: 'Test', startTime: Date.now() - 600000, 
                     endTime: Date.now(), colors: { primary: '#007bff', border: '#0056b3' } }];
  render(<MobileTimeline entries={entries} totalDuration={600000} currentTime={Date.now()} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

### Manual Testing
- Resize to 375px width
- Test timeline toggle, bottom nav navigation
- Verify forms don't zoom on iOS (16px font)
- Test swipe gestures
- Check PWA install prompt after 30s
- Run Lighthouse (target: mobile score >90)

## Deployment

```bash
npm run lint
npm run type-check
npm test
npm run build
npm run start
# Deploy via Vercel/Netlify
```

## Success Metrics
- [ ] Mobile bounce rate < 40%
- [ ] Page load < 3s
- [ ] Lighthouse score > 90
- [ ] All 5 phases complete

## Troubleshooting

**Bottom nav overlaps content:** Add `padding-bottom: calc(56px + env(safe-area-inset-bottom) + 16px)` to `.main-content-wrapper`

**Forms zoom on iOS:** Ensure input `font-size: 16px !important`

**PWA prompt doesn't show:** Check HTTPS, valid manifest, service worker registered

---
**End of PWA Guide** | Implementation time: 80 hours | All code is production-ready
