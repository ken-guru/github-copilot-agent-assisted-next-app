import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';

// Import both routing components for testing
import AppRouterHome from '../../src/app/page';
import PagesRouterBridge from '../../pages/index';

// Mock necessary hooks and components
jest.mock('../../src/hooks/useActivityState', () => ({
  useActivityState: () => ({
    currentActivity: null,
    timelineEntries: [],
    completedActivityIds: [],
    allActivitiesCompleted: false,
    handleActivitySelect: jest.fn(),
    handleActivityRemoval: jest.fn(),
    resetActivities: jest.fn(),
  })
}));

jest.mock('../../src/hooks/useTimerState', () => ({
  useTimerState: () => ({
    elapsedTime: 0,
    isTimeUp: false,
    timerActive: false,
    startTimer: jest.fn(),
    resetTimer: jest.fn(),
  })
}));

jest.mock('../../src/utils/serviceWorkerRegistration', () => ({
  registerServiceWorker: jest.fn(),
  setUpdateHandler: jest.fn()
}));

describe('Integrated Routing System', () => {
  beforeEach(() => {
    // Mock window.matchMedia
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true
    });

    // Mock MutationObserver
    global.MutationObserver = class {
      observe = jest.fn();
      disconnect = jest.fn();
    };
  });

  it('should verify App Router component renders independently', async () => {
    render(<AppRouterHome />);
    
    // Check for App Router component rendering
    expect(screen.getByText(/Mr. Timely/i)).toBeInTheDocument();
  });

  it('should verify Pages Router bridge integrates with App Router component', async () => {
    render(<PagesRouterBridge />);
    
    // Check for App Router component rendering through the bridge
    expect(screen.getByText(/Mr. Timely/i)).toBeInTheDocument();
  });

  it('should verify correct routing structure exists', () => {
    const appRouterPagePath = path.join(process.cwd(), 'src/app/page.tsx');
    const pagesRouterIndexPath = path.join(process.cwd(), 'pages/index.tsx');
    const appRouterExists = fs.existsSync(appRouterPagePath);
    const pagesRouterExists = fs.existsSync(pagesRouterIndexPath);
    
    expect(appRouterExists).toBe(true);
    expect(pagesRouterExists).toBe(true);
    
    // Both should exist for the bridge implementation to work
    if (appRouterExists && pagesRouterExists) {
      const appRouterContent = fs.readFileSync(appRouterPagePath, 'utf8');
      const pagesRouterContent = fs.readFileSync(pagesRouterIndexPath, 'utf8');
      
      // App Router should export a Home component
      expect(appRouterContent).toContain('export default function Home');
      
      // Pages Router should import the App Router component
      expect(pagesRouterContent).toContain('import AppRouterHome from');
    }
  });
});
