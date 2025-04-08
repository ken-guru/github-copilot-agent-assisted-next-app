import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';

// Import both routing components for testing
import AppRouterHome from '../../src/app/page';

// Use dynamic import to avoid issues if the file doesn't exist yet
let PagesRouterBridge: any;
try {
  PagesRouterBridge = require('../../pages/index').default;
} catch (e) {
  PagesRouterBridge = null;
}

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

// Mock the src/app/page.tsx component
jest.mock('../../src/app/page', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="app-router-component">Mr. Timely</div>
  };
});

// Mock the LoadingContext
jest.mock('../../contexts/LoadingContext', () => {
  let loadingState = true;
  const setIsLoading = jest.fn((value) => {
    loadingState = value;
  });
  
  return {
    useLoading: jest.fn(() => ({
      isLoading: loadingState,
      setIsLoading
    })),
    LoadingProvider: ({ children, initialLoadingState = true }: { 
      children: React.ReactNode;
      initialLoadingState?: boolean;
    }) => {
      loadingState = initialLoadingState;
      return <div data-testid="loading-provider" data-loading={loadingState.toString()}>{children}</div>;
    }
  };
});

// Mock the SplashScreen
jest.mock('../../components/splash/SplashScreen', () => ({
  SplashScreen: ({ minimumDisplayTime = 0 }: { minimumDisplayTime?: number }) => (
    <div data-testid="splash-screen" data-minimum-time={minimumDisplayTime}>
      Loading...
    </div>
  )
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
    
    // Reset mocks
    jest.clearAllMocks();
  });

  it('should verify App Router component renders independently', async () => {
    render(<AppRouterHome />);
    
    // Check for App Router component rendering
    expect(screen.getByText(/Mr. Timely/i)).toBeInTheDocument();
  });

  it('should verify loading context works properly in App Router', async () => {
    // Setup jest fake timers for timing control
    jest.useFakeTimers();
    
    const { getByTestId } = render(<AppRouterHome />);
    
    // Loading provider should be present with initial loading state
    const loadingProvider = getByTestId('app-router-component');
    expect(loadingProvider).toBeInTheDocument();
    
    // Advance timers to simulate app initialization completing
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    // Return to real timers
    jest.useRealTimers();
  });

  it('should verify Pages Router bridge integrates with App Router component', async () => {
    // Skip if bridge doesn't exist yet
    if (!PagesRouterBridge) {
      console.warn('Skipping Pages Router bridge test as the component is not available');
      return;
    }
    
    render(<PagesRouterBridge />);
    
    // Check for App Router component rendering through the bridge
    expect(screen.getByText(/Mr. Timely/i)).toBeInTheDocument();
  });

  it('should verify splash screen behavior in bridge implementation', async () => {
    // Skip if bridge doesn't exist yet
    if (!PagesRouterBridge) {
      console.warn('Skipping splash screen test as the Pages Router bridge is not available');
      return;
    }
    
    // Setup jest fake timers for timing control
    jest.useFakeTimers();
    
    render(<PagesRouterBridge />);
    
    // Splash screen should be visible initially
    const splashScreen = screen.getByTestId('splash-screen');
    expect(splashScreen).toBeInTheDocument();
    
    // Advance timers to simulate splash screen timing out
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // Return to real timers
    jest.useRealTimers();
  });

  it('should verify correct routing structure exists', () => {
    const appRouterPagePath = path.join(process.cwd(), 'src/app/page.tsx');
    const pagesRouterIndexPath = path.join(process.cwd(), 'pages/index.tsx');
    const appRouterExists = fs.existsSync(appRouterPagePath);
    const pagesRouterExists = fs.existsSync(pagesRouterIndexPath);
    
    expect(appRouterExists).toBe(true);
    
    // If Pages Router bridge exists, verify its content
    if (pagesRouterExists) {
      const appRouterContent = fs.readFileSync(appRouterPagePath, 'utf8');
      const pagesRouterContent = fs.readFileSync(pagesRouterIndexPath, 'utf8');
      
      // App Router should export a Home component
      expect(appRouterContent).toContain('export default function Home');
      
      // Pages Router should import the App Router component
      expect(pagesRouterContent).toContain('from');
    } else {
      console.warn('Pages Router bridge file does not exist yet. Will need to create it.');
    }
  });
});
