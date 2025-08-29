import React, { useState, useEffect } from 'react';
import styles from './TimeSetupMaterial3.module.css';

interface TimeSetupMaterial3Props {
  onTimeSet: (durationInSeconds: number) => void;
}

export default function TimeSetupMaterial3({ onTimeSet }: TimeSetupMaterial3Props) {
  const [setupMode, setSetupMode] = useState<'duration' | 'deadline'>('duration');
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [deadlineTime, setDeadlineTime] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [errors, setErrors] = useState<{
    hours?: string;
    minutes?: string;
    seconds?: string;
    deadline?: string;
    general?: string;
  }>({});

  // Prevent hydration mismatch by only running time calculations on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const validateDurationInputs = () => {
    const newErrors: typeof errors = {};
    
    if (hours < 0 || hours > 23) {
      newErrors.hours = 'Hours must be between 0 and 23';
    }
    
    if (minutes < 0 || minutes > 59) {
      newErrors.minutes = 'Minutes must be between 0 and 59';
    }
    
    if (seconds < 0 || seconds > 59) {
      newErrors.seconds = 'Seconds must be between 0 and 59';
    }
    
    if (hours === 0 && minutes === 0 && seconds === 0) {
      newErrors.general = 'Please set a duration greater than 0';
    }
    
    return newErrors;
  };

  const validateDeadlineInput = () => {
    const newErrors: typeof errors = {};
    
    if (!deadlineTime) {
      newErrors.deadline = 'Please select a deadline time';
      return newErrors;
    }
    
    if (!isClient) return newErrors;
    
    const now = new Date();
    const [hoursStr, minutesStr] = deadlineTime.split(':');
    
    const deadlineDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      parseInt(hoursStr || '0'),
      parseInt(minutesStr || '0')
    );
    
    // If the time is earlier today, assume it's for tomorrow
    if (deadlineDate <= now) {
      deadlineDate.setDate(deadlineDate.getDate() + 1);
    }
    
    const durationInSeconds = Math.floor((deadlineDate.getTime() - now.getTime()) / 1000);
    
    if (durationInSeconds <= 0) {
      newErrors.deadline = 'Deadline must be in the future';
    }
    
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only calculate time on the client to prevent hydration mismatch
    if (!isClient) return;
    
    let validationErrors: typeof errors = {};
    let durationInSeconds = 0;
    
    if (setupMode === 'duration') {
      validationErrors = validateDurationInputs();
      if (Object.keys(validationErrors).length === 0) {
        durationInSeconds = hours * 3600 + minutes * 60 + seconds;
      }
    } else {
      validationErrors = validateDeadlineInput();
      if (Object.keys(validationErrors).length === 0) {
        const now = new Date();
        const [hoursStr, minutesStr] = deadlineTime.split(':');
        
        const deadlineDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          parseInt(hoursStr || '0'),
          parseInt(minutesStr || '0')
        );
        
        // If the time is earlier today, assume it's for tomorrow
        if (deadlineDate <= now) {
          deadlineDate.setDate(deadlineDate.getDate() + 1);
        }
        
        durationInSeconds = Math.max(0, Math.floor((deadlineDate.getTime() - now.getTime()) / 1000));
      }
    }
    
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      onTimeSet(durationInSeconds);
    }
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setHours(isNaN(value) ? 0 : value);
    if (errors.hours || errors.general) {
      setErrors(prev => ({ ...prev, hours: undefined, general: undefined }));
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setMinutes(isNaN(value) ? 0 : value);
    if (errors.minutes || errors.general) {
      setErrors(prev => ({ ...prev, minutes: undefined, general: undefined }));
    }
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setSeconds(isNaN(value) ? 0 : value);
    if (errors.seconds || errors.general) {
      setErrors(prev => ({ ...prev, seconds: undefined, general: undefined }));
    }
  };

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeadlineTime(e.target.value);
    if (errors.deadline) {
      setErrors(prev => ({ ...prev, deadline: undefined }));
    }
  };

  return (
    <div
      className={styles.timeSetup}
      data-testid="time-setup-material3"
      data-mode={setupMode}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Set Time</h2>
      </div>
      
      <div className={styles.content}>
        {/* Expressive segmented button group for mode selection */}
        <div className={styles.modeSelector} role="group" aria-label="Time setup mode selection">
          <button
            type="button"
            onClick={() => setSetupMode('duration')}
            className={`${styles.modeButton} ${setupMode === 'duration' ? styles.modeButtonActive : ''}`}
            data-testid="duration-mode-button"
          >
            Set Duration
          </button>
          <button
            type="button"
            onClick={() => setSetupMode('deadline')}
            className={`${styles.modeButton} ${setupMode === 'deadline' ? styles.modeButtonActive : ''}`}
            data-testid="deadline-mode-button"
          >
            Set Deadline
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form} data-testid="time-setup-form" id="time-setup-form">
          {setupMode === 'duration' ? (
            <div className={styles.durationInputs} data-testid="duration-inputs">
              <div className={styles.inputGroup}>
                <label htmlFor="hours" className={styles.inputLabel}>Hours</label>
                <input
                  id="hours"
                  type="number"
                  min="0"
                  max="23"
                  value={isClient ? hours.toString() : "0"}
                  onChange={handleHoursChange}
                  className={`${styles.input} ${errors.hours ? styles.inputError : ''}`}
                  data-testid="hours-input"
                />
                {errors.hours && <div className={styles.helperText}>{errors.hours}</div>}
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="minutes" className={styles.inputLabel}>Minutes</label>
                <input
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={isClient ? minutes.toString() : "0"}
                  onChange={handleMinutesChange}
                  className={`${styles.input} ${errors.minutes ? styles.inputError : ''}`}
                  data-testid="minutes-input"
                />
                {errors.minutes && <div className={styles.helperText}>{errors.minutes}</div>}
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="seconds" className={styles.inputLabel}>Seconds</label>
                <input
                  id="seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={isClient ? seconds.toString() : "0"}
                  onChange={handleSecondsChange}
                  className={`${styles.input} ${errors.seconds ? styles.inputError : ''}`}
                  data-testid="seconds-input"
                />
                {errors.seconds && <div className={styles.helperText}>{errors.seconds}</div>}
              </div>
            </div>
          ) : (
            <div data-testid="deadline-input-group">
              <div className={styles.inputGroup}>
                <label htmlFor="deadlineTime" className={styles.inputLabel}>Deadline Time</label>
                <input
                  id="deadlineTime"
                  type="time"
                  value={isClient ? (deadlineTime || '') : ''}
                  onChange={handleDeadlineChange}
                  className={`${styles.input} ${errors.deadline ? styles.inputError : ''}`}
                  data-testid="deadline-input"
                />
                <div className={styles.helperText}>
                  {errors.deadline || "Select a time for today or tomorrow"}
                </div>
              </div>
            </div>
          )}
          
          {errors.general && (
            <div className={styles.generalError} role="alert">
              {errors.general}
            </div>
          )}
        </form>
      </div>
      
      <div className={styles.footer}>
        <button
          type="submit"
          form="time-setup-form"
          className={styles.submitButton}
          data-testid="set-time-button"
          onClick={handleSubmit}
        >
          Set Time
        </button>
      </div>
    </div>
  );
}