import React from 'react';
import { render, screen } from '@testing-library/react';
import TimeDisplay from '../TimeDisplay';

// Mock react-bootstrap components
jest.mock('react-bootstrap/Card', () => {
  const Card = ({ children, className, ...props }: any) => (
    <div className={`card ${className || ''}`} {...props}>{children}</div>
  );
  Card.Body = ({ children, className, ...props }: any) => (
    <div className={`card-body ${className || ''}`} {...props}>{children}</div>
  );
  Card.Header = ({ children, className, ...props }: any) => (
    <div className={`card-header ${className || ''}`} {...props}>{children}</div>
  );
  return Card;
});

jest.mock('react-bootstrap/Badge', () => ({ children, bg, className, ...props }: any) => (
  <span className={`badge bg-${bg || 'primary'} ${className || ''}`} {...props}>{children}</span>
));

describe('TimeDisplay Component', () => {
  // Test data with proper typing
  const testDateTime = new Date('2023-01-01T12:00:00Z');
  const testFormattedTime = '12:00 PM';
  const testFormattedDate = 'January 1, 2023';
  
  const renderComponent = (props: {
    formattedTime?: string;
    formattedDate?: string;
    timeFormat?: string;
    dateFormat?: string;
    variant?: 'default' | 'compact' | 'large' | 'horizontal' | 'card' | 'minimal';
    status?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    showTimezone?: boolean;
    timezone?: string;
  }) => {
    return render(
      <TimeDisplay dateTime={testDateTime}
        formattedTime={props.formattedTime || testFormattedTime}
        formattedDate={props.formattedDate || testFormattedDate}
        timeFormat={props.timeFormat}
        dateFormat={props.dateFormat}
        variant={props.variant}
        status={props.status}
        showTimezone={props.showTimezone}
        timezone={props.timezone}
      />
    );
  };

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
  
  const testOrderOfElements = (): void => {
    // Test implementation for element order using text content
    const timeText = screen.getByText(testFormattedTime);
    const dateText = screen.getByText(testFormattedDate);
    
    expect(timeText).toBeInTheDocument();
    expect(dateText).toBeInTheDocument();
    
    // Verify time appears before date in the DOM
    expect(timeText.compareDocumentPosition(dateText) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  };
  
  test('displays time before date', () => {
    renderComponent({});
    testOrderOfElements();
  });

  test('renders timezone when showTimezone is true', () => {
    const testTimezone = 'America/New_York';
    renderComponent({ showTimezone: true, timezone: testTimezone });
    expect(findTextElement(testTimezone)).toBeInTheDocument();
  });

  test('renders with different variants', () => {
    const { container } = renderComponent({ variant: 'compact' });
    // When using compact variant, the component should have a different class
    expect(container.querySelector('.time-display-compact')).not.toBeNull();
  });

  test('renders with different status', () => {
    const { container } = renderComponent({ status: 'success' });
    // When using success status, the component should have a success indicator
    expect(container.querySelector('.bg-success')).not.toBeNull();
  });
});