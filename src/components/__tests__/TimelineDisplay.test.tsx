import React from 'react';
import { render, screen } from '@testing-library/react';
import TimelineDisplay from '../TimelineDisplay';

describe('TimelineDisplay Component', () => {
  // Test data with proper typing
  const testEvents = [
    { id: '1', title: 'Event 1', date: new Date('2023-01-01'), description: 'First event' },
    { id: '2', title: 'Event 2', date: new Date('2023-01-15'), description: 'Second event' }
  ];

  // Replace 'any' with a proper interface type for the component props
  interface TimelineDisplayProps {
    events: Array<{
      id: string;
      title: string;
      date: Date;
      description: string;
    }>;
    displayOrder?: 'asc' | 'desc';
    showDescriptions?: boolean;
  }

  const renderComponent = (props: TimelineDisplayProps) => {
    return render(<TimelineDisplay {...props} />);
  };

  test('renders all events', () => {
    renderComponent({ events: testEvents });
    
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
    expect(screen.getByText('First event')).toBeInTheDocument();
    expect(screen.getByText('Second event')).toBeInTheDocument();
  });

  test('renders events in ascending order by default', () => {
    renderComponent({ events: testEvents });
    
    const eventElements = screen.getAllByTestId('timeline-event');
    expect(eventElements[0]).toHaveTextContent('Event 1');
    expect(eventElements[1]).toHaveTextContent('Event 2');
  });

  test('renders events in descending order when specified', () => {
    renderComponent({ 
      events: testEvents,
      displayOrder: 'desc' 
    });
    
    const eventElements = screen.getAllByTestId('timeline-event');
    expect(eventElements[0]).toHaveTextContent('Event 2');
    expect(eventElements[1]).toHaveTextContent('Event 1');
  });

  test('can hide descriptions when specified', () => {
    renderComponent({ 
      events: testEvents,
      showDescriptions: false 
    });
    
    expect(screen.queryByText('First event')).not.toBeInTheDocument();
    expect(screen.queryByText('Second event')).not.toBeInTheDocument();
  });

  test('handles empty events array', () => {
    renderComponent({ events: [] });
    
    expect(screen.getByText('No events to display')).toBeInTheDocument();
  });
});