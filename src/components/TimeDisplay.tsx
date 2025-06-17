import React from 'react';
import { Card, Badge } from 'react-bootstrap';

interface TimeDisplayProps {
  dateTime: Date;
  formattedTime: string;
  formattedDate: string;
  timeFormat?: string;
  dateFormat?: string;
  variant?: 'default' | 'compact' | 'large' | 'horizontal' | 'card' | 'minimal';
  status?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  interactive?: boolean;
  loading?: boolean;
  showTimezone?: boolean;
  timezone?: string;
  live?: boolean;
  className?: string;
}

/**
 * TimeDisplay Component
 * 
 * Displays formatted time and date information with various styling options
 * using Bootstrap components and utility classes
 */
const TimeDisplay: React.FC<TimeDisplayProps> = ({ 
  formattedTime, 
  formattedDate, 
  timeFormat, 
  dateFormat,
  variant = 'default',
  status = 'default',
  interactive = false,
  loading = false,
  showTimezone = false,
  timezone,
  live = false,
  className
}) => {
  const renderTime = (time: string): React.ReactElement => {
    return (
      <div className="time-display-time fw-bold">
        {time}
      </div>
    );
  };

  const renderDate = (date: string): React.ReactElement => {
    return (
      <div className="time-display-date text-muted">
        {date}
      </div>
    );
  };

  const renderTimezone = (): React.ReactElement | null => {
    if (!showTimezone) return null;
    
    const timezoneText = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return (
      <div className="time-display-timezone small text-secondary mt-1">
        {timezoneText}
      </div>
    );
  };

  const formatTimeWithCustomFormat = (time: string, format: string): string => {
    // Implement basic formatting logic to use the format parameter
    // This is a placeholder implementation - real implementation would depend on requirements
    console.log(`Formatting time ${time} with format ${format}`);
    return time;
  };

  const formatDateWithCustomFormat = (date: string, format: string): string => {
    // Implement basic formatting logic to use the format parameter
    // This is a placeholder implementation - real implementation would depend on requirements
    console.log(`Formatting date ${date} with format ${format}`);
    return date;
  };

  const displayTime = timeFormat 
    ? formatTimeWithCustomFormat(formattedTime, timeFormat)
    : formattedTime;

  const displayDate = dateFormat
    ? formatDateWithCustomFormat(formattedDate, dateFormat)
    : formattedDate;

  // Determine appropriate CSS classes based on props
  const containerClasses = [
    'time-display',
    variant !== 'default' && `time-display-${variant}`,
    interactive && 'cursor-pointer',
    loading && 'opacity-50',
    live && 'time-display-live',
    className
  ].filter(Boolean).join(' ');

  // Get appropriate Bootstrap status color
  const getStatusColor = (): 'success' | 'warning' | 'danger' | 'info' | undefined => {
    if (status === 'default') return undefined;
    return status as 'success' | 'warning' | 'danger' | 'info';
  };

  // Render component based on variant
  if (variant === 'card') {
    return (
      <Card 
        className={containerClasses}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={interactive ? `Time: ${displayTime}, Date: ${displayDate}` : undefined}
      >
        <Card.Body className="p-2">
          {status !== 'default' && (
            <Badge bg={getStatusColor()} className="mb-2">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          )}
          {renderTime(displayTime)}
          {renderDate(displayDate)}
          {renderTimezone()}
          
          {(timeFormat || dateFormat) && (
            <div className="mt-2 small text-muted">
              {timeFormat && (
                <div className="me-2 d-inline-block">
                  Format: {timeFormat}
                </div>
              )}
              {dateFormat && (
                <div className="d-inline-block">
                  Format: {dateFormat}
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    );
  }

  // Simple div container for other variants
  return (
    <div 
      className={containerClasses}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `Time: ${displayTime}, Date: ${displayDate}` : undefined}
    >
      {status !== 'default' && (
        <Badge bg={getStatusColor()} className="mb-2">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )}
      {renderTime(displayTime)}
      {renderDate(displayDate)}
      {renderTimezone()}
      
      {(timeFormat || dateFormat) && (
        <div className="mt-2 small text-muted">
          {timeFormat && (
            <div className="me-2 d-inline-block">
              Format: {timeFormat}
            </div>
          )}
          {dateFormat && (
            <div className="d-inline-block">
              Format: {dateFormat}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeDisplay;