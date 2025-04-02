import React from 'react';

interface Event {
  id: string;
  title: string;
  date: Date;
  description: string;
}

interface TimelineDisplayProps {
  events: Event[];
  displayOrder?: 'asc' | 'desc';
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