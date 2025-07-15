import React from 'react';

/**
 * Represents an event to be displayed in the timeline
 */
interface Event {
  /**
   * Unique identifier for the event
   */
  id: string;
  
  /**
   * Title/heading of the event
   */
  title: string;
  
  /**
   * Date when the event occurred
   */
  date: Date;
  
  /**
   * Detailed description of the event
   */
  description: string;
}

/**
 * Props for the TimelineDisplay component
 */
interface TimelineDisplayProps {
  /**
   * Array of events to display in the timeline
   */
  events: Event[];
  
  /**
   * Order in which to display events
   * - 'asc': Chronological order (oldest first)
   * - 'desc': Reverse chronological order (newest first)
   * @default 'asc'
   */
  displayOrder?: 'asc' | 'desc';
  
  /**
   * Whether to show event descriptions
   * @default true
   */
  showDescriptions?: boolean;
}

/**
 * TimelineDisplay Component
 * 
 * Displays a list of events in chronological order
 */
const TimelineDisplay: React.FC<TimelineDisplayProps> = ({ 
  events, 
  displayOrder = 'asc', 
  showDescriptions = true 
}) => {
  // Handle empty events array
  if (events.length === 0) {
    return <div data-testid="empty-timeline">No events to display</div>;
  }

  // Sort events based on displayOrder
  const sortedEvents = [...events].sort((a, b) => {
    const comparison = a.date.getTime() - b.date.getTime();
    return displayOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="timeline-display">
      {sortedEvents.map((event) => (
        <div key={event.id} data-testid="timeline-event" className="timeline-event">
          <h3>{event.title}</h3>
          <div className="timeline-date">
            {event.date.toLocaleDateString()}
          </div>
          {showDescriptions && (
            <div className="timeline-description">
              {event.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TimelineDisplay;
