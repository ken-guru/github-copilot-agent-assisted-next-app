/**
 * Jest Setup for Visual Regression Tests
 * Global setup and configuration for visual testing environment
 */

const { chromium } = require('playwright');

// Global test timeout
jest.setTimeout(30000);

// Global setup for visual tests
beforeAll(async () => {
  // Ensure test server is running
  const isServerRunning = await checkServerHealth();
  if (!isServerRunning) {
    console.warn('⚠️  Test server not running on http://localhost:3000');
    console.warn('   Please start the development server with: npm run dev');
  }
});

// Global cleanup
afterAll(async () => {
  // Cleanup any global resources
  if (global.__BROWSER__) {
    await global.__BROWSER__.close();
  }
});

// Helper function to check if development server is running
async function checkServerHealth() {
  try {
    const response = await fetch('http://localhost:3000/api/health');
    return response.ok;
  } catch (error) {
    // If health endpoint doesn't exist, try the main page
    try {
      const response = await fetch('http://localhost:3000');
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Custom matchers for visual testing
expect.extend({
  toHaveVisualDifference(received, expected, threshold = 0.1) {
    const pass = received.difference <= threshold;
    
    if (pass) {
      return {
        message: () => `Expected visual difference ${received.difference}% to be greater than ${threshold}%`,
        pass: true
      };
    } else {
      return {
        message: () => `Expected visual difference ${received.difference}% to be less than or equal to ${threshold}%`,
        pass: false
      };
    }
  },

  toBeAccessible(received) {
    const violations = received.violations || [];
    const pass = violations.length === 0;
    
    if (pass) {
      return {
        message: () => 'Expected accessibility violations',
        pass: true
      };
    } else {
      const violationMessages = violations.map(v => `${v.impact}: ${v.description}`).join(', ');
      return {
        message: () => `Expected no accessibility violations, but found: ${violationMessages}`,
        pass: false
      };
    }
  },

  toHaveGoodPerformance(received, expectedFPS = 55) {
    const pass = received.fps >= expectedFPS;
    
    if (pass) {
      return {
        message: () => `Expected FPS ${received.fps} to be less than ${expectedFPS}`,
        pass: true
      };
    } else {
      return {
        message: () => `Expected FPS ${received.fps} to be at least ${expectedFPS}`,
        pass: false
      };
    }
  },

  toMeetContrastRequirements(received, level = 'AA') {
    const requiredRatio = level === 'AAA' ? 7 : 4.5;
    const pass = received.contrastRatio >= requiredRatio;
    
    if (pass) {
      return {
        message: () => `Expected contrast ratio ${received.contrastRatio} to be less than ${requiredRatio}`,
        pass: true
      };
    } else {
      return {
        message: () => `Expected contrast ratio ${received.contrastRatio} to meet WCAG ${level} requirements (${requiredRatio}:1)`,
        pass: false
      };
    }
  }
});

// Console formatting for better test output
const originalConsoleLog = console.log;
console.log = (...args) => {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  originalConsoleLog(`[${timestamp}]`, ...args);
};

// Error handling for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Global error handler for visual tests
global.handleVisualTestError = (error, context) => {
  console.error(`Visual test error in ${context}:`, error);
  
  // Take screenshot on error if browser is available
  if (global.__PAGE__) {
    const timestamp = Date.now();
    const screenshotPath = `src/tests/visual-regression/error-screenshots/error-${timestamp}.png`;
    
    global.__PAGE__.screenshot({ path: screenshotPath }).catch(screenshotError => {
      console.error('Failed to take error screenshot:', screenshotError);
    });
  }
};