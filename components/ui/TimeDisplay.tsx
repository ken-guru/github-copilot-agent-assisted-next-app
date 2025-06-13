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
      <div className={styles.time}>
        {time}
      </div>
    );
  };

  const renderDate = (date: string): React.ReactElement => {
    return (
      <div className={styles.date}>
        {date}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <time 
        dateTime={new Date().toISOString()}
        className={styles.timeWrapper}
      >
        {renderTime(formattedTime)}
        {renderDate(formattedDate)}
      </time>
      {(timeFormat || dateFormat) && (
        <div className={styles.formatInfo}>
          {timeFormat && (
            <span className={styles.formatTime}>
              Format: {timeFormat}
            </span>
          )}
          {dateFormat && (
            <span className={styles.formatDate}>
              Format: {dateFormat}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeDisplay;
