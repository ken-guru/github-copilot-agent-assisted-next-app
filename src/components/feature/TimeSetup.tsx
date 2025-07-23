import { useState } from 'react';
import styles from './TimeSetup.module.css';

/**
 * Props for the TimeSetup component
 * 
 * @interface TimeSetupProps
 */
export interface TimeSetupProps {
  /**
   * Callback when a time has been set
   * 
   * @param durationInSeconds - The selected duration in seconds
   * @returns {void}
   */
  onTimeSet: (durationInSeconds: number) => void;
  
  /**
   * Initial mode for time input
   * @default 'duration'
   */
  initialMode?: 'duration' | 'deadline';
  
  /**
   * Initial value for hours
   * @default 0
   */
  initialHours?: number;
  
  /**
   * Initial value for minutes
   * @default 0
   */
  initialMinutes?: number;
  
  /**
   * Initial value for seconds
   * @default 0
   */
  initialSeconds?: number;
  
  /**
   * Initial value for deadline in format "HH:MM"
   * @default Current time
   */
  initialDeadlineTime?: string;
}

export default function TimeSetup({
  onTimeSet,
  initialMode,
  initialHours = 0,
  initialMinutes = 0,
  initialSeconds = 0,
  initialDeadlineTime
}: TimeSetupProps) {
  const [setupMode, setSetupMode] = useState<'duration' | 'deadline'>(initialMode || 'duration');
  const [hours, setHours] = useState<string>(initialHours.toString());
  const [minutes, setMinutes] = useState<string>(initialMinutes.toString());
  const [seconds, setSeconds] = useState<string>(initialSeconds.toString());
  
  // Initialize deadline time with current time if not provided
  const [deadlineTime, setDeadlineTime] = useState<string>(
    initialDeadlineTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  );

  // Form validation state
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let durationInSeconds = 0;
    if (setupMode === 'duration') {
      const h = hours === '' ? 0 : parseInt(hours);
      const m = minutes === '' ? 0 : parseInt(minutes);
      const s = seconds === '' ? 0 : parseInt(seconds);
      durationInSeconds = h * 3600 + m * 60 + s;
      // Validate duration input
      if (durationInSeconds <= 0) {
        setHasError(true);
        setErrorMessage('Please enter a duration greater than 0 seconds');
        return;
      }
    } else {
      // Convert the time string to today's date with that time
      const now = new Date();
      const [hoursStr, minutesStr] = deadlineTime.split(':');
      const deadlineDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        parseInt(hoursStr || '0'),
        parseInt(minutesStr || '0')
      );
      // If the deadline is in the past, assume it's for tomorrow
      if (deadlineDate <= now) {
        deadlineDate.setDate(deadlineDate.getDate() + 1);
      }
      // Calculate seconds until deadline
      durationInSeconds = Math.max(0, Math.floor((deadlineDate.getTime() - now.getTime()) / 1000));
      // Validate deadline input
      if (durationInSeconds <= 0) {
        setHasError(true);
        setErrorMessage('Please enter a valid future time');
        return;
      }
    }
    // Clear any previous errors
    setHasError(false);
    setErrorMessage('');
    // Call the callback with the calculated duration
    onTimeSet(durationInSeconds);
  };

  const handleModeChange = (mode: 'duration' | 'deadline') => {
    setSetupMode(mode);
    // Clear any previous errors when switching modes
    setHasError(false);
    setErrorMessage('');
  };

  const handleNumberInput = (value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    // Allow empty string for controlled input
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
      setter(value);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Set Up Time</h2>
      
      <div className={styles.modeSelector}>
        <button
          type="button"
          className={`${styles.button} ${styles.modeButton} ${setupMode === 'duration' ? styles.modeButtonActive : ''}`}
          onClick={() => handleModeChange('duration')}
        >
          Duration
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.modeButton} ${setupMode === 'deadline' ? styles.modeButtonActive : ''}`}
          onClick={() => handleModeChange('deadline')}
        >
          Deadline
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {setupMode === 'duration' ? (
          <div className={styles.inputGroup}>
            <div className={styles.timeInput}>
              <label htmlFor="hours" className={styles.label}>Hours</label>
              <input
                type="number"
                id="hours"
                min="0"
                value={hours}
                onChange={(e) => handleNumberInput(e.target.value, setHours)}
                onBlur={() => { if (hours === '') setHours('0'); }}
                className={`${styles.input} ${hasError ? styles.inputError : ''}`}
              />
            </div>
            
            <div className={styles.timeInput}>
              <label htmlFor="minutes" className={styles.label}>Minutes</label>
              <input
                type="number"
                id="minutes"
                min="0"
                max="59"
                step="1"
                value={minutes}
                onChange={(e) => handleNumberInput(e.target.value, setMinutes)}
                onBlur={() => { if (minutes === '') setMinutes('0'); }}
                className={`${styles.input} ${hasError ? styles.inputError : ''}`}
              />
            </div>
            
            <div className={styles.timeInput}>
              <label htmlFor="seconds" className={styles.label}>Seconds</label>
              <input
                type="number"
                id="seconds"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => handleNumberInput(e.target.value, setSeconds)}
                onBlur={() => { if (seconds === '') setSeconds('0'); }}
                className={`${styles.input} ${hasError ? styles.inputError : ''}`}
              />
            </div>
          </div>
        ) : (
          <div className={styles.timeInput}>
            <label htmlFor="deadlineTime" className={styles.label}>Time (24-hour format)</label>
            <input
              type="time"
              id="deadlineTime"
              value={deadlineTime}
              onChange={(e) => setDeadlineTime(e.target.value)}
              className={`${styles.input} ${styles.deadlineInput} ${hasError ? styles.inputError : ''}`}
            />
          </div>
        )}
        
        {hasError && <div className={styles.error}>{errorMessage}</div>}
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={setupMode === 'duration' && (parseInt(hours || '0') === 0 && parseInt(minutes || '0') === 0 && parseInt(seconds || '0') === 0)}
        >
          Start Timer
        </button>
      </form>
    </div>
  );
}
