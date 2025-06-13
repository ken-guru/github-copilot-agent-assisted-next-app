import React from 'react';

/**
 * Props for the TimeDisplay component
 */
interface TimeDisplayProps {
  /**
   * The date and time to display
   */
  dateTime: Date;
  
  /**
   * Pre-formatted time string to display
   */
  formattedTime: string;
  
  /**
   * Pre-formatted date string to display
   */
  formattedDate: string;
  
  /**
   * The format used for the time (for display purposes only)
   * Example: "HH:mm:ss"
   */
  timeFormat?: string;
  
  /**
   * The format used for the date (for display purposes only)
   * Example: "YYYY-MM-DD"
   */
  dateFormat?: string;
}

/**
 * TimeDisplay Component
 * 
 * Displays formatted time and date information
 */
const TimeDisplay: React.FC<TimeDisplayProps> = ({ 
  formattedTime, 
  formattedDate, 
  timeFormat, 
  dateFormat 
}) => {
  const renderTime = (time: string): React.ReactElement => {
    return (
      <div>
        {time}
      </div>
    );
  };

  const renderDate = (date: string): React.ReactElement => {
    return (
      <div>
        {date}
      </div>
    );
  };

  return (
    <div>
      <time dateTime={new Date().toISOString()}
        
      >
        {renderTime(formattedTime)}
        {renderDate(formattedDate)}
      </time>
      {(timeFormat || dateFormat) && (
        <div>
          {timeFormat && (
            <span>
              Format: {timeFormat}
            </span>
          )}
          {dateFormat && (
            <span>
              Format: {dateFormat}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeDisplay;
