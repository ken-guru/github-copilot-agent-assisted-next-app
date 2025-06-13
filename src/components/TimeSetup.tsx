import { useState } from 'react';

interface TimeSetupProps {
  onTimeSet: (durationInSeconds: number) => void;
}

export default function TimeSetup({ onTimeSet }: TimeSetupProps) {
  const [setupMode, setSetupMode] = useState<'duration' | 'deadline'>('duration');
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [deadlineTime, setDeadlineTime] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let durationInSeconds = 0;
    
    if (setupMode === 'duration') {
      durationInSeconds = hours * 3600 + minutes * 60 + seconds;
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
      
      // If the time is earlier today, assume it's for tomorrow
      if (deadlineDate <= now) {
        deadlineDate.setDate(deadlineDate.getDate() + 1);
      }
      
      durationInSeconds = Math.max(0, Math.floor((deadlineDate.getTime() - now.getTime()) / 1000));
    }
    
    onTimeSet(durationInSeconds);
  };

  return (
    <div  data-testid="time-setup">
      <h2 >Set Time</h2>
      
      <div >
        <button
          type="button"
           ${setupMode === 'duration' ? styles.buttonPrimary : styles.buttonSecondary}`}
          onClick={() => setSetupMode('duration')}
        >
          Set Duration
        </button>
        <button
          type="button"
           ${setupMode === 'deadline' ? styles.buttonPrimary : styles.buttonSecondary}`}
          onClick={() => setSetupMode('deadline')}
        >
          Set Deadline
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {setupMode === 'duration' ? (
          <div >
            <div >
              <label htmlFor="hours" >Hours</label>
              <input
                type="number"
                id="hours"
                min="0"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                
              />
            </div>
            <div >
              <label htmlFor="minutes" >Minutes</label>
              <input
                type="number"
                id="minutes"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                
              />
            </div>
            <div >
              <label htmlFor="seconds" >Seconds</label>
              <input
                type="number"
                id="seconds"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                
              />
            </div>
          </div>
        ) : (
          <div >
            <label htmlFor="deadlineTime" >Deadline Time</label>
            <input
              type="time"
              id="deadlineTime"
              value={deadlineTime}
              onChange={(e) => setDeadlineTime(e.target.value)}
              
            />
          </div>
        )}
        
        <button
          type="submit"
          
        >
          Set Time
        </button>
      </form>
    </div>
  );
}