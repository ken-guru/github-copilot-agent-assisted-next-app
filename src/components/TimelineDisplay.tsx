import React from 'react';
import styles from './TimelineDisplay.module.css';

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
 * Displays a list of events in chronological order with accessible design
 * Features: semantic HTML, keyboard navigation, responsive design, timeline visualization
 */
const TimelineDisplay: React.FC<TimelineDisplayProps> = ({ 
  events, 
  displayOrder = 'asc', 
  showDescriptions = true 
}) => {
  // Handle empty events array
  if (events.length === 0) {
    return (
      <div 
        className={styles.emptyState}
        data-testid="empty-timeline"
        role="status"
        aria-live="polite"
      >
        No events to display
      </div>
    );
  }

  // Sort events based on displayOrder
  const sortedEvents = [...events].sort((a, b) => {
    const comparison = a.date.getTime() - b.date.getTime();
    return displayOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <section 
      className={styles.timelineDisplay}
      role="region" 
      aria-label={`Timeline with ${sortedEvents.length} events in ${displayOrder}ending order`}
    >
      {sortedEvents.map((event, index) => (
        <article 
          key={event.id} 
          data-testid="timeline-event" 
          className={styles.timelineEvent}
          role="article"
          aria-labelledby={`event-title-${event.id}`}
          aria-describedby={showDescriptions ? `event-desc-${event.id}` : `event-date-${event.id}`}
          tabIndex={0}
        >
          <h3 
            id={`event-title-${event.id}`}
            className={styles.eventTitle}
          >
            {event.title}
          </h3>
          <time 
            className={styles.eventDate}
            id={`event-date-${event.id}`}
            dateTime={event.date.toISOString()}
            aria-label={`Event date: ${event.date.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}`}
          >
            {event.date.toLocaleDateString()}
          </time>
          {showDescriptions && (
            <div 
              className={styles.eventDescription}
              id={`event-desc-${event.id}`}
              role="text"
            >
              {event.description}
            </div>
          )}
        </article>
      ))}
    </section>
  );
};

export default TimelineDisplay;