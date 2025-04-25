import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import LazyLoadingExample from '../examples/LazyLoadingExample';
import { loadingPerformanceData } from '../../utils/lazyLoading';

// Mock the lazy loaded components
jest.mock('../visualizations/Chart', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="chart-component">Chart Component</div>
  };
});

jest.mock('../DataTable', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="data-table-component">Data Table Component</div>
  };
});

jest.mock('../TimelineDetail', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="timeline-detail-component">Timeline Detail Component</div>
  };
});

// Mock performance metrics
jest.mock('../../utils/lazyLoading', () => {
  return {
    lazyWithPreload: (factory, callback) => {
      // Create a mock lazy component for testing
      const Component = () => {
        const LazyComponent = factory().then(module => module.default);
        return <LazyComponent />;
      };
      
      // Add mock preload method
      Component.preload = jest.fn();
      
      return Component;
    },
    useComponentPreloader: () => jest.fn(),
    loadingPerformanceData: {
      addMetric: jest.fn(),
      getSummary: jest.fn().mockReturnValue({
        averageLoadTimeMs: 120.5,
        maxLoadTimeMs: 200.3,
        minLoadTimeMs: 50.1,
        totalComponentsLoaded: 3
      }),
      clear: jest.fn()
    }
  };
});

describe('LazyLoadingExample Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('renders with Chart component as default tab', async () => {
    render(<LazyLoadingExample />);
    
    // Check that tabs are rendered
    expect(screen.getByText('Chart View')).toBeInTheDocument();
    expect(screen.getByText('Table View')).toBeInTheDocument();
    expect(screen.getByText('Timeline View')).toBeInTheDocument();
    
    // Initially should show Chart component
    expect(await screen.findByTestId('chart-component')).toBeInTheDocument();
  });
  
  test('switches between tabs correctly', async () => {
    render(<LazyLoadingExample />);
    
    // Click on Table View tab
    fireEvent.click(screen.getByText('Table View'));
    
    // Should show Data Table component
    expect(await screen.findByTestId('data-table-component')).toBeInTheDocument();
    
    // Click on Timeline View tab
    fireEvent.click(screen.getByText('Timeline View'));
    
    // Should show Timeline Detail component
    expect(await screen.findByTestId('timeline-detail-component')).toBeInTheDocument();
    
    // Back to Chart View
    fireEvent.click(screen.getByText('Chart View'));
    
    // Should show Chart component again
    expect(await screen.findByTestId('chart-component')).toBeInTheDocument();
  });
  
  test('shows performance metrics when requested', async () => {
    render(<LazyLoadingExample />);
    
    // Initially performance metrics should not be shown
    expect(screen.queryByText('Performance Metrics')).not.toBeInTheDocument();
    
    // Click on Show Loading Performance button
    fireEvent.click(screen.getByText('Show Loading Performance'));
    
    // Performance metrics should now be visible
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
    expect(screen.getByText('Average Load Time: 120.50ms')).toBeInTheDocument();
    expect(screen.getByText('Max Load Time: 200.30ms')).toBeInTheDocument();
    expect(screen.getByText('Min Load Time: 50.10ms')).toBeInTheDocument();
    expect(screen.getByText('Total Components Loaded: 3')).toBeInTheDocument();
  });
  
  test('preloads components on tab hover', () => {
    render(<LazyLoadingExample />);
    
    // Hover over Table View tab
    fireEvent.mouseEnter(screen.getByText('Table View'));
    
    // Should have called preload
    expect(jest.mocked(useComponentPreloader)).toHaveBeenCalled();
  });
});
