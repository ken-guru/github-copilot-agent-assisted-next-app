import React from 'react';
import styles from './StatusIndicator.module.css';

export type StatusType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'running';
export type SizeType = 'small' | 'medium' | 'large';

interface StatusIndicatorProps {
  /**
   * The status to display
   */
  status: StatusType;
  
  /**
   * Optional text label to display next to the indicator
   */
  label?: string;
  
  /**
   * Whether to apply a pulsing animation (automatically applied to 'running' status)
   */
  pulsing?: boolean;
  
  /**
   * Size of the indicator
   */
  size?: SizeType;
  
  /**
   * Additional CSS class
   */
  className?: string;
  
  /**
   * Custom test ID for testing
   */
  testId?: string;
}

/**
 * A visual indicator for different statuses (success, error, etc.)
 */
const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  pulsing = false,
  size = 'medium',
  className = '',
  testId = 'status-indicator',
}) => {
  // Automatically apply pulsing to running status unless explicitly disabled
  const shouldPulse = status === 'running' || pulsing;
  
  // Compose CSS classes
  const indicatorClasses = [
    styles.indicator,
    styles[status],
    styles[size],
    shouldPulse ? styles.pulsing : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={styles.container}>
      <span 
        className={indicatorClasses}
        data-testid={testId}
      ></span>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
};

export default StatusIndicator;