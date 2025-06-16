import React from 'react';
import { render, screen } from '@testing-library/react';
import TimeDisplay from '../TimeDisplay';

describe('TimeDisplay Component', () => {
  // Test data with proper typing
  const testDateTime = new Date('2023-01-01T12:00:00Z');
  const testFormattedTime = '12:00 PM';
  const testFormattedDate = 'January 1, 2023';
  
  // Replace any with proper type
  const renderComponent = (props: {
    formattedTime?: string;
    formattedDate?: string;
    timeFormat?: string;
    dateFormat?: string;
  }) => {
    return render(
      <TimeDisplay dateTime={testDateTime}
        formattedTime={props.formattedTime || testFormattedTime}
        formattedDate={props.formattedDate || testFormattedDate}
        timeFormat={props.timeFormat}
        dateFormat={props.dateFormat}
      />
    );
  };

  // Replace any with proper type
  const findTextElement = (text: string): HTMLElement => {
    return screen.getByText(text);
  };

  test('renders time correctly', () => {
    renderComponent({});
    expect(findTextElement(testFormattedTime)).toBeInTheDocument();
  });

  test('renders date correctly', () => {
    renderComponent({});
    expect(findTextElement(testFormattedDate)).toBeInTheDocument();
  });

  test('renders with custom time format', () => {
    const customTimeFormat = '12-00-00';
    renderComponent({
      formattedTime: customTimeFormat,
      timeFormat: 'HH-mm-ss'
    });
    expect(findTextElement(customTimeFormat)).toBeInTheDocument();
  });

  test('renders with custom date format', () => {
    const customDateFormat = '01/01/2023';
    renderComponent({
      formattedDate: customDateFormat,
      dateFormat: 'MM/DD/YYYY'
    });
    expect(findTextElement(customDateFormat)).toBeInTheDocument();
  });
  
  // Replace any with proper type
  const testOrderOfElements = (container: HTMLElement): void => {
    // Test implementation for element order using text content
    const timeText = screen.getByText(testFormattedTime);
    const dateText = screen.getByText(testFormattedDate);
    
    expect(timeText).toBeInTheDocument();
    expect(dateText).toBeInTheDocument();
    
    // Verify time appears before date in the DOM
    expect(timeText.compareDocumentPosition(dateText) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  };
  
  test('displays time before date', () => {
    const { container } = renderComponent({});
    testOrderOfElements(container as HTMLElement);
  });
});