import React from 'react';
import { render, screen } from '@testing-library/react';
import TimeDisplay from './TimeDisplay';

describe('TimeDisplay Component', () => {
  // Define test data with proper typing instead of 'any'
  const testDateTime = new Date('2023-01-01T12:00:00Z');
  const testFormattedTime = '12:00 PM';
  const testFormattedDate = 'January 1, 2023';
  
  test('renders time correctly', () => {
    render(
      <TimeDisplay 
        dateTime={testDateTime} 
        formattedTime={testFormattedTime} 
        formattedDate={testFormattedDate} 
      />
    );
    expect(screen.getByText(testFormattedTime)).toBeInTheDocument();
  });

  test('renders date correctly', () => {
    render(
      <TimeDisplay 
        dateTime={testDateTime} 
        formattedTime={testFormattedTime} 
        formattedDate={testFormattedDate} 
      />
    );
    expect(screen.getByText(testFormattedDate)).toBeInTheDocument();
  });

  test('renders with custom time format', () => {
    const customTimeFormat = '12-00-00';
    render(
      <TimeDisplay 
        dateTime={testDateTime} 
        formattedTime={customTimeFormat} 
        formattedDate={testFormattedDate}
        timeFormat="HH-mm-ss"
      />
    );
    expect(screen.getByText(customTimeFormat)).toBeInTheDocument();
  });

  test('renders with custom date format', () => {
    const customDateFormat = '01/01/2023';
    render(
      <TimeDisplay 
        dateTime={testDateTime} 
        formattedTime={testFormattedTime} 
        formattedDate={customDateFormat}
        dateFormat="MM/DD/YYYY"
      />
    );
    expect(screen.getByText(customDateFormat)).toBeInTheDocument();
  });
});