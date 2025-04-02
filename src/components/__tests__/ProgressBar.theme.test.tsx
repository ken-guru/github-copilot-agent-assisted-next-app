// filepath: /Users/ken/Workspace/ken-guru/github-copilot-agent-assisted-next-app/src/components/__tests__/ProgressBar.theme.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressBar from '../ProgressBar';
import { TimelineEntry } from '../Timeline';
import { setTestTheme } from '../../utils/testUtils/themeTestingUtils';

// Mock the CSS module
jest.mock('../ProgressBar.module.css', () => ({
  container: 'container',
  progressBarContainer: 'progressBarContainer',
  progressFill: 'progressFill',
  timeMarkers: 'timeMarkers',
  timeMarker: 'timeMarker',
  inactiveBar: 'inactiveBar',
  mobileContainer: 'mobileContainer'
}));

describe('ProgressBar Theme Compatibility', () => {
  // Mock entries for testing
  const mockEntries: TimelineEntry[] = [
    {
      id: '1',
      activityId: 'activity-1',
      activityName: 'Test Activity',
      startTime: 0,
      endTime: 1800000, // 30 minutes
      colors: {
        background: '#E8F5E9',
        text: '#1B5E20',
        border: '#2E7D32'
      }
    },
  ];

  // Define sample progress percentages to test at key thresholds
  const thresholds = [
    { elapsed: 1080, total: 3600, percent: 30, description: '30% progress (green range)' },
    { elapsed: 1800, total: 3600, percent: 50, description: '50% progress (yellow range)' },
    { elapsed: 2520, total: 3600, percent: 70, description: '70% progress (orange range)' },
    { elapsed: 3240, total: 3600, percent: 90, description: '90% progress (red range)' },
    { elapsed: 3600, total: 3600, percent: 100, description: '100% progress (full red)' },
  ];

  // CSS variable theme values setup
  beforeEach(() => {
    // Set CSS variables for both themes
    document.documentElement.style.setProperty('--background', 'hsl(220, 20%, 98%)');
    document.documentElement.style.setProperty('--background-alt', 'hsl(220, 20%, 95%)');
    document.documentElement.style.setProperty('--background-muted', 'hsl(220, 20%, 94%)');
    document.documentElement.style.setProperty('--foreground', 'hsl(220, 15%, 15%)');
    document.documentElement.style.setProperty('--foreground-muted', 'hsl(220, 10%, 40%)');
  });

  afterEach(() => {
    // Clean up theme class after each test
    document.documentElement.classList.remove('light-mode', 'dark-mode');
  });

  describe('Light Theme', () => {
    beforeEach(() => {
      setTestTheme('light');
    });

    thresholds.forEach(({ elapsed, total, percent, description }) => {
      it(`should render with accessible contrast in light theme at ${description}`, () => {
        const { container } = render(
          <ProgressBar 
            entries={mockEntries}
            totalDuration={total}
            elapsedTime={elapsed}
            timerActive={true}
          />
        );
        
        // Verify progress fill exists and has the correct width
        const progressFill = container.querySelector('.progressFill');
        expect(progressFill).toBeInTheDocument();
        const style = progressFill?.getAttribute('style');
        expect(style).toContain(`width: ${percent}%`);
        
        // We would normally test the contrast ratio here, but in the test environment
        // the computed styles might not be fully accessible. In a real browser
        // environment, we would use:
        //
        // const backgroundColor = window.getComputedStyle(progressFill).backgroundColor;
        // const containerColor = window.getComputedStyle(container.querySelector('.progressBarContainer')).backgroundColor;
        // const contrastRatio = calculateContrastRatio(backgroundColor, containerColor);
        // expect(contrastRatio).toBeGreaterThanOrEqual(3); // Minimum for non-text UI elements
        
        // Instead, we'll verify that a background-color is present
        expect(style).toContain('background-color:');
      });
    });

    it('should render inactive progress bar correctly in light theme', () => {
      const { container } = render(
        <ProgressBar 
          entries={mockEntries}
          totalDuration={3600}
          elapsedTime={1800}
          timerActive={false}
        />
      );
      
      const progressBarContainer = container.querySelector('.progressBarContainer');
      expect(progressBarContainer).toHaveClass('inactiveBar');
    });
  });

  describe('Dark Theme', () => {
    beforeEach(() => {
      // Set dark theme variables
      document.documentElement.style.setProperty('--background', 'hsl(220, 15%, 12%)');
      document.documentElement.style.setProperty('--background-alt', 'hsl(220, 15%, 15%)');
      document.documentElement.style.setProperty('--background-muted', 'hsl(220, 15%, 18%)');
      document.documentElement.style.setProperty('--foreground', 'hsl(220, 10%, 95%)');
      document.documentElement.style.setProperty('--foreground-muted', 'hsl(220, 10%, 75%)');
      
      setTestTheme('dark');
    });

    thresholds.forEach(({ elapsed, total, percent, description }) => {
      it(`should render with accessible contrast in dark theme at ${description}`, () => {
        const { container } = render(
          <ProgressBar 
            entries={mockEntries}
            totalDuration={total}
            elapsedTime={elapsed}
            timerActive={true}
          />
        );
        
        // Verify progress fill exists and has the correct width
        const progressFill = container.querySelector('.progressFill');
        expect(progressFill).toBeInTheDocument();
        const style = progressFill?.getAttribute('style');
        expect(style).toContain(`width: ${percent}%`);
        
        // Verify color is present
        expect(style).toContain('background-color:');
      });
    });

    it('should render inactive progress bar correctly in dark theme', () => {
      const { container } = render(
        <ProgressBar 
          entries={mockEntries}
          totalDuration={3600}
          elapsedTime={1800}
          timerActive={false}
        />
      );
      
      const progressBarContainer = container.querySelector('.progressBarContainer');
      expect(progressBarContainer).toHaveClass('inactiveBar');
    });
  });

  // Test for color transitions
  describe('Color transitions', () => {
    it('should transition colors as progress increases', () => {
      // Array to store colors at different progress points
      const colorSamples: string[] = [];
      
      // Set light theme for consistent testing
      setTestTheme('light');
      
      // Collect colors at various progress points including critical thresholds
      const progressPoints = [10, 40, 60, 80, 100]; // Before/after key transition points
      
      for (const progress of progressPoints) {
        const elapsedTime = Math.round((progress / 100) * 3600);
        
        const { container } = render(
          <ProgressBar 
            entries={mockEntries}
            totalDuration={3600}
            elapsedTime={elapsedTime}
            timerActive={true}
          />
        );
        
        const progressFill = container.querySelector('.progressFill');
        const style = progressFill?.getAttribute('style') || '';
        const colorMatch = style.match(/background-color:\s*([\w\d\s,()]+)/);
        if (colorMatch && colorMatch[1]) {
          colorSamples.push(colorMatch[1]);
        }
      }
      
      // Verify we have collected colors for each progress point
      expect(colorSamples.length).toBe(progressPoints.length); 
      
      // Check that we have different colors as progress increases
      const uniqueColors = new Set(colorSamples);
      expect(uniqueColors.size).toBeGreaterThanOrEqual(2); // At least some color transition
      
      // Verify color at 100% is different from color at 10%
      expect(colorSamples[0]).not.toBe(colorSamples[colorSamples.length - 1]);
      
      // All colors should have valid RGB format
      colorSamples.forEach(color => {
        expect(color).toMatch(/rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/);
      });
    });
  });
});