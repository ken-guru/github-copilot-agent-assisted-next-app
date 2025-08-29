import React, { useState, useEffect } from 'react';
import { Material3TextField } from './ui/Material3TextField';
import { Material3Button } from './ui/Material3Button';
import { Material3FormGroup } from './ui/Material3FormGroup';
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
    const clampedValue = isNaN(value) ? 0 : Math.max(0, Math.min(23, value));
    setHours(clampedValue);
    if (errors.hours || errors.general) {
      setErrors(prev => ({ ...prev, hours: undefined, general: undefined }));
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    const clampedValue = isNaN(value) ? 0 : Math.max(0, Math.min(59, value));
    setMinutes(clampedValue);
    if (errors.minutes || errors.general) {
      setErrors(prev => ({ ...prev, minutes: undefined, general: undefined }));
    }
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    const clampedValue = isNaN(value) ? 0 : Math.max(0, Math.min(59, value));
    setSeconds(clampedValue);
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
    <div className={styles.timeSetup} data-testid="time-setup-material3">
      <div className={styles.header}>
        <h2 className={styles.title}>Set Time</h2>
      </div>
      
      <div className={styles.content}>
        <div className={styles.modeSelector}>
          <Material3Button
            variant={setupMode === 'duration' ? 'filled' : 'outlined'}
            onClick={() => setSetupMode('duration')}
            className={styles.modeButton}
            data-testid="duration-mode-button"
          >
            Set Duration
          </Material3Button>
          <Material3Button
            variant={setupMode === 'deadline' ? 'filled' : 'outlined'}
            onClick={() => setSetupMode('deadline')}
            className={styles.modeButton}
            data-testid="deadline-mode-button"
          >
            Set Deadline
          </Material3Button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form} data-testid="time-setup-form" id="time-setup-form">
          {setupMode === 'duration' ? (
            <Material3FormGroup 
              direction="row" 
              spacing="comfortable"
              className={styles.durationInputs}
              data-testid="duration-inputs"
            >
              <Material3TextField
                id="hours"
                label="Hours"
                type="number"
                value={isClient ? hours.toString() : "0"}
                onChange={handleHoursChange}
                min="0"
                max="23"
                error={!!errors.hours}
                helperText={errors.hours}
                size="medium"
                data-testid="hours-input"
              />
              <Material3TextField
                id="minutes"
                label="Minutes"
                type="number"
                value={isClient ? minutes.toString() : "0"}
                onChange={handleMinutesChange}
                min="0"
                max="59"
                error={!!errors.minutes}
                helperText={errors.minutes}
                size="medium"
                data-testid="minutes-input"
              />
              <Material3TextField
                id="seconds"
                label="Seconds"
                type="number"
                value={isClient ? seconds.toString() : "0"}
                onChange={handleSecondsChange}
                min="0"
                max="59"
                error={!!errors.seconds}
                helperText={errors.seconds}
                size="medium"
                data-testid="seconds-input"
              />
            </Material3FormGroup>
          ) : (
            <Material3FormGroup 
              spacing="comfortable"
              data-testid="deadline-input-group"
            >
              <Material3TextField
                id="deadlineTime"
                label="Deadline Time"
                type="time"
                value={isClient ? (deadlineTime || '') : ''}
                onChange={handleDeadlineChange}
                error={!!errors.deadline}
                helperText={errors.deadline || "Select a time for today or tomorrow"}
                size="medium"
                data-testid="deadline-input"
              />
            </Material3FormGroup>
          )}
          
          {errors.general && (
            <div className={styles.generalError} role="alert">
              {errors.general}
            </div>
          )}
        </form>
      </div>
      
      <div className={styles.footer}>
        <Material3Button
          type="submit"
          variant="filled"
          size="large"
          form="time-setup-form"
          className={styles.submitButton}
          data-testid="set-time-button"
          onClick={handleSubmit}
        >
          Set Time
        </Material3Button>
      </div>
    </div>
  );
}