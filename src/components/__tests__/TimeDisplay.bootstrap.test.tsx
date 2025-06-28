import React from 'react';
import { render } from '@testing-library/react';
import TimeDisplay from '../TimeDisplay';

describe('TimeDisplay Bootstrap Integration', () => {
  const testDateTime = new Date('2023-01-01T12:00:00Z');
  const testFormattedTime = '12:00 PM';
  const testFormattedDate = 'January 1, 2023';

  const renderComponent = (props: {
    formattedTime?: string;
    formattedDate?: string;
    timeFormat?: string;
    dateFormat?: string;
  }) => {
    return render(
      <TimeDisplay 
        dateTime={testDateTime}
        formattedTime={props.formattedTime ?? testFormattedTime}
        formattedDate={props.formattedDate ?? testFormattedDate}
        timeFormat={props.timeFormat}
        dateFormat={props.dateFormat}
      />
    );
  };

  describe('Bootstrap Typography Classes', () => {
    test('uses Bootstrap display classes for time text', () => {
      const { container } = renderComponent({});
      const timeElement = container.querySelector('[data-testid="time-value"]');
      
      expect(timeElement).toHaveClass('h4');
      expect(timeElement).toHaveClass('fw-bold');
      expect(timeElement).toHaveClass('text-primary');
      expect(timeElement).toHaveClass('mb-1');
    });

    test('uses Bootstrap typography classes for date text', () => {
      const { container } = renderComponent({});
      const dateElement = container.querySelector('[data-testid="date-value"]');
      
      expect(dateElement).toHaveClass('text-muted');
      expect(dateElement).toHaveClass('fw-normal');
      expect(dateElement).toHaveClass('small');
    });

    test('applies monospace font for time consistency', () => {
      const { container } = renderComponent({});
      const timeElement = container.querySelector('[data-testid="time-value"]');
      
      expect(timeElement).toHaveClass('font-monospace');
    });
  });

  describe('Bootstrap Layout Structure', () => {
    test('uses Bootstrap container with proper spacing', () => {
      const { container } = renderComponent({});
      const containerElement = container.querySelector('[data-testid="time-display-container"]');
      
      expect(containerElement).toHaveClass('d-flex');
      expect(containerElement).toHaveClass('flex-column');
      expect(containerElement).toHaveClass('align-items-center');
      expect(containerElement).toHaveClass('text-center');
    });

    test('applies proper semantic HTML with Bootstrap styling', () => {
      const { container } = renderComponent({});
      const timeElement = container.querySelector('time');
      
      expect(timeElement).toBeInTheDocument();
      expect(timeElement).toHaveAttribute('dateTime', testDateTime.toISOString());
      expect(timeElement).toHaveClass('d-block');
    });
  });

  describe('Bootstrap Responsive Design', () => {
    test('uses responsive text sizing classes', () => {
      const { container } = renderComponent({});
      const timeElement = container.querySelector('[data-testid="time-value"]');
      
      // Should use responsive sizing
      expect(timeElement).toHaveClass('h4');
      // Could also test for responsive classes like h4-sm, h3-md if implemented
    });

    test('applies responsive spacing classes', () => {
      const { container } = renderComponent({});
      const containerElement = container.querySelector('[data-testid="time-display-container"]');
      
      expect(containerElement).toHaveClass('p-2');
      expect(containerElement).toHaveClass('p-md-3');
    });
  });

  describe('Bootstrap Theme Integration', () => {
    test('uses Bootstrap text color utilities', () => {
      const { container } = renderComponent({});
      const timeElement = container.querySelector('[data-testid="time-value"]');
      const dateElement = container.querySelector('[data-testid="date-value"]');
      
      expect(timeElement).toHaveClass('text-primary');
      expect(dateElement).toHaveClass('text-muted');
    });

    test('applies proper contrast with Bootstrap utilities', () => {
      const { container } = renderComponent({});
      const timeElement = container.querySelector('[data-testid="time-value"]');
      
      // Ensures readability with Bootstrap's color system
      expect(timeElement).toHaveClass('text-primary');
      expect(timeElement).not.toHaveClass('text-light'); // Avoid low contrast
    });
  });

  describe('Bootstrap Custom Format Styling', () => {
    test('maintains Bootstrap classes with custom time format', () => {
      const customTimeFormat = '14:30:45';
      const { container } = renderComponent({
        formattedTime: customTimeFormat,
        timeFormat: 'HH:mm:ss'
      });
      
      const timeElement = container.querySelector('[data-testid="time-value"]');
      expect(timeElement).toHaveClass('font-monospace');
      expect(timeElement).toHaveClass('h4');
      expect(timeElement).toHaveTextContent(customTimeFormat);
    });

    test('maintains Bootstrap classes with custom date format', () => {
      const customDateFormat = '01/01/2023';
      const { container } = renderComponent({
        formattedDate: customDateFormat,
        dateFormat: 'MM/DD/YYYY'
      });
      
      const dateElement = container.querySelector('[data-testid="date-value"]');
      expect(dateElement).toHaveClass('text-muted');
      expect(dateElement).toHaveClass('small');
      expect(dateElement).toHaveTextContent(customDateFormat);
    });
  });

  describe('Bootstrap Element Order and Structure', () => {
    test('maintains proper Bootstrap flex order', () => {
      const { container } = renderComponent({});
      const containerElement = container.querySelector('[data-testid="time-display-container"]');
      const timeElement = container.querySelector('[data-testid="time-value"]');
      const dateElement = container.querySelector('[data-testid="date-value"]');
      
      expect(containerElement).toHaveClass('d-flex');
      expect(containerElement).toHaveClass('flex-column');
      
      // Verify time appears before date in DOM order
      if (timeElement && dateElement) {
        expect(timeElement.compareDocumentPosition(dateElement) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      }
    });

    test('uses proper Bootstrap spacing between elements', () => {
      const { container } = renderComponent({});
      const timeElement = container.querySelector('[data-testid="time-value"]');
      
      expect(timeElement).toHaveClass('mb-1');
    });
  });

  describe('Bootstrap Conditional Rendering', () => {
    test('handles empty date with Bootstrap structure intact', () => {
      const { container } = renderComponent({
        formattedDate: ''
      });
      
      const timeElement = container.querySelector('[data-testid="time-value"]');
      const dateElement = container.querySelector('[data-testid="date-value"]');
      
      expect(timeElement).toBeInTheDocument();
      expect(timeElement).toHaveClass('h4');
      expect(dateElement).not.toBeInTheDocument();
    });

    test('maintains Bootstrap container classes when date is hidden', () => {
      const { container } = renderComponent({
        formattedDate: ''
      });
      
      const containerElement = container.querySelector('[data-testid="time-display-container"]');
      expect(containerElement).toHaveClass('d-flex');
      expect(containerElement).toHaveClass('flex-column');
      expect(containerElement).toHaveClass('align-items-center');
    });
  });

  describe('Bootstrap Accessibility Integration', () => {
    test('maintains semantic HTML with Bootstrap classes', () => {
      const { container } = renderComponent({});
      const timeElement = container.querySelector('time');
      
      expect(timeElement).toHaveAttribute('dateTime', testDateTime.toISOString());
      expect(timeElement).toHaveClass('d-block');
    });

    test('uses Bootstrap screen reader utilities when needed', () => {
      const { container } = renderComponent({
        timeFormat: 'HH:mm:ss'
      });
      
      // Could include sr-only classes for additional context
      const timeElement = container.querySelector('[data-testid="time-value"]');
      expect(timeElement).toBeInTheDocument();
      // Test would verify any sr-only content if added
    });
  });
});
