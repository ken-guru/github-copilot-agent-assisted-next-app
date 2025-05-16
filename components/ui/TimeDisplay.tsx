import React from 'react';
import styles from './TimeDisplay.module.css';

interface TimeDisplayProps {
  dateTime: Date;
  formattedTime: string;
  formattedDate: string;
  timeFormat?: string;
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
