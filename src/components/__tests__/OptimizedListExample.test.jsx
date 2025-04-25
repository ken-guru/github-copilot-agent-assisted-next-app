import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import OptimizedListExample from '../examples/OptimizedListExample';
import * as renderOptimization from '../../utils/renderOptimization';

// Mock the rendering optimization utilities
jest.mock('../../utils/renderOptimization', () => {
  const original = jest.requireActual('../../utils/renderOptimization');
  
  return {
    ...original,
    useMemoizedValue: jest.fn((value) => value),
    useStableCallback: jest.fn((fn) => fn),
    useDebouncedValue: jest.fn((value, delay) => value),
    useThrottledCallback: jest.fn((fn) => fn),
    usePreventUnnecessaryRenders: jest.fn((component) => component),
    measureRenderTime: jest.fn(() => jest.fn()),
    useRenderWarning: jest.fn()
  };
});

describe('OptimizedListExample', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset the mocked functions to pass through values
    renderOptimization.useMemoizedValue.mockImplementation(value => value);
    renderOptimization.useStableCallback.mockImplementation(fn => fn);
    renderOptimization.useDebouncedValue.mockImplementation(value => value);
    renderOptimization.useThrottledCallback.mockImplementation(fn => fn);
  });
  
  test('renders initial list of items', () => {
    render(<OptimizedListExample initialItemCount={5} />);
    
    // Should render title
    expect(screen.getByText('Optimized List Example')).toBeInTheDocument();
    
    // Should render filter input
    expect(screen.getByLabelText(/filter/i)).toBeInTheDocument();
    
    // Should render refresh button
    expect(screen.getByText('Refresh Items')).toBeInTheDocument();
    
    // Should render all items
    const itemElements = screen.getAllByText(/Item \d/);
    expect(itemElements).toHaveLength(5);
  });
  
  test('filters items based on input', () => {
    // Setup debounced value to immediately return the input value
    renderOptimization.useDebouncedValue.mockImplementation(value => value);
    
    render(<OptimizedListExample initialItemCount={10} />);
    
    // Filter for items with "5" in the name
    const filterInput = screen.getByLabelText(/filter/i);
    fireEvent.change(filterInput, { target: { value: '5' } });
    
    // Should only show items with "5" in the name (Item 5)
    const itemElements = screen.getAllByText(/Item \d/);
    expect(itemElements).toHaveLength(1);
    expect(itemElements[0]).toHaveTextContent('Item 5');
  });
  
  test('selects items when clicked', () => {
    render(<OptimizedListExample initialItemCount={5} />);
    
    // Click on the first item's select button
    const selectButtons = screen.getAllByText('Select');
    fireEvent.click(selectButtons[0]);
    
    // Should show selected item details
    expect(screen.getByText('Selected Item')).toBeInTheDocument();
    expect(screen.getByText(/ID: item-0/)).toBeInTheDocument();
    expect(screen.getByText(/Name: Item 0/)).toBeInTheDocument();
  });
  
  test('refreshes items when button is clicked', () => {
    render(<OptimizedListExample initialItemCount={5} />);
    
    // Get initial items
    const initialItems = screen.getAllByText(/Item \d/);
    
    // Click refresh button
    fireEvent.click(screen.getByText('Refresh Items'));
    
    // Items should still be visible (though potentially with different values)
    const refreshedItems = screen.getAllByText(/Item \d/);
    expect(refreshedItems).toHaveLength(initialItems.length);
  });
  
  test('uses optimization hooks correctly', () => {
    render(<OptimizedListExample initialItemCount={5} />);
    
    // Check that our optimization hooks were called
    expect(renderOptimization.useMemoizedValue).toHaveBeenCalled();
    expect(renderOptimization.useStableCallback).toHaveBeenCalled();
    expect(renderOptimization.useDebouncedValue).toHaveBeenCalled();
    expect(renderOptimization.useThrottledCallback).toHaveBeenCalled();
    expect(renderOptimization.measureRenderTime).toHaveBeenCalled();
  });
  
  test('debounces filter input', () => {
    // Mock the debounced value to simulate delay
    let setDebouncedValue;
    renderOptimization.useDebouncedValue.mockImplementation((value, delay) => {
      if (!setDebouncedValue) {
        // Initialize with empty string
        setDebouncedValue = jest.fn();
        return '';
      }
      return '';
    });
    
    render(<OptimizedListExample initialItemCount={5} />);
    
    // Change filter value
    const filterInput = screen.getByLabelText(/filter/i);
    fireEvent.change(filterInput, { target: { value: 'test' } });
    
    // Should have called debounce with correct params
    expect(renderOptimization.useDebouncedValue).toHaveBeenCalledWith('test', 300);
  });
});
