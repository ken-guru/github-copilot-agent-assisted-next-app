import { useState } from 'react';

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
    <div>
      <h2>Set Up Time</h2>
      
      <div>
        <button type="button"
          onClick={() => handleModeChange('duration')}
        >
          Duration
        </button>
        <button type="button"
          onClick={() => handleModeChange('deadline')}
        >
          Deadline
        </button>
      </div>
      
      <form onSubmit={handleSubmit} >
        {setupMode === 'duration' ? (
          <div>
            <div>
              <label htmlFor="hours" >Hours</label>
              <input type="number"
                id="hours"
                min="0"
                value={hours}
                onChange={(e) => handleNumberInput(e.target.value, setHours)}
              />
            </div>
            
            <div>
              <label htmlFor="minutes" >Minutes</label>
              <input type="number"
                id="minutes"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => handleNumberInput(e.target.value, setMinutes)}
              />
            </div>
            
            <div>
              <label htmlFor="seconds" >Seconds</label>
              <input type="number"
                id="seconds"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => handleNumberInput(e.target.value, setSeconds)}
              />
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="deadlineTime" >Time (24-hour format)</label>
            <input type="time"
              id="deadlineTime"
              value={deadlineTime}
              onChange={(e) => setDeadlineTime(e.target.value)}
            />
          </div>
        )}
        
        {hasError && <div>{errorMessage}</div>}
        
        <button type="submit" 
          
          disabled={setupMode === 'duration' && hours === 0 && minutes === 0 && seconds === 0}
        >
          Start Timer
        </button>
      </form>
    </div>
  );
}
