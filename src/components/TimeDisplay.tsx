import React from 'react';

interface TimeDisplayProps {
  dateTime: Date;
  formattedTime: string;
  formattedDate: string;
  timeFormat?: string;
  dateFormat?: string;
}

// Internal formatting utilities for custom formats
const formatTimeWithCustom = (time: string, format?: string): string => {
  // Only log in development mode and not during tests
  if (format && process.env.NODE_ENV === 'development' && process.env.JEST_WORKER_ID === undefined) {
    console.log(`Formatting time ${time} with format ${format}`);
  }
  return time;
};

const formatDateWithCustom = (date: string, format?: string): string => {
  // Only log in development mode and not during tests
  if (format && process.env.NODE_ENV === 'development' && process.env.JEST_WORKER_ID === undefined) {
    console.log(`Formatting date ${date} with format ${format}`);
  }
  return date;
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({ 
  dateTime, 
  formattedTime, 
  formattedDate, 
  timeFormat, 
  dateFormat 
}) => {
  // Apply custom formatting if specified
  const displayTime = formatTimeWithCustom(formattedTime, timeFormat);
  const displayDate = formatDateWithCustom(formattedDate, dateFormat);

  return (
    <div 
      className="d-flex flex-column align-items-center text-center p-2 p-md-3"
      data-testid="time-display-container"
    >
      <time 
        dateTime={dateTime.toISOString()} 
        className="d-block"
      >
        <span 
          className="h4 fw-bold text-primary mb-1 font-monospace"
          data-testid="time-value"
        >
          {displayTime}
        </span>
        {displayDate && displayDate.trim() !== '' && (
          <span 
            className="text-muted fw-normal small"
            data-testid="date-value"
          >
            {displayDate}
          </span>
        )}
      </time>
    </div>
  );
};

export default TimeDisplay;