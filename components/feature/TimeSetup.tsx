import { useState } from 'react';
import styles from './TimeSetup.module.css';

interface TimeSetupProps {
  onTimeSet: (durationInSeconds: number) => void;
  initialMode?: 'duration' | 'deadline';
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
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
  const [hours, setHours] = useState<number>(initialHours);
  const [minutes, setMinutes] = useState<number>(initialMinutes);
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  
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
      durationInSeconds = hours * 3600 + minutes * 60 + seconds;
      
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

  const handleNumberInput = (value: string, setter: React.Dispatch<React.SetStateAction<number>>) => {
    const parsed = parseInt(value);
    if (!isNaN(parsed) && parsed >= 0) {
      setter(parsed);
    } else {
      setter(0);
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
                value={minutes}
                onChange={(e) => handleNumberInput(e.target.value, setMinutes)}
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
          disabled={setupMode === 'duration' && hours === 0 && minutes === 0 && seconds === 0}
        >
          Start Timer
        </button>
      </form>
    </div>
  );
}
