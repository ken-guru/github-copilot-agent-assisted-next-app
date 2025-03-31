import { useState } from 'react';
import { Button, Card } from '@/components/common';
import styles from './TimeSetup.module.css';

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
    <Card
      className={styles.container}
      title="Set Time"
      data-testid="time-setup"
      padding="medium"
    >
      <div className={styles.modeSelector}>
        <Button
          onClick={() => setSetupMode('duration')}
          className={setupMode === 'duration' ? styles.buttonPrimary : styles.buttonSecondary}
          variant={setupMode === 'duration' ? 'primary' : 'secondary'}
        >
          Set Duration
        </Button>
        <Button
          onClick={() => setSetupMode('deadline')}
          className={setupMode === 'deadline' ? styles.buttonPrimary : styles.buttonSecondary}
          variant={setupMode === 'deadline' ? 'primary' : 'secondary'}
        >
          Set Deadline
        </Button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {setupMode === 'duration' ? (
          <div className={styles.inputGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="hours" className={styles.label}>Hours</label>
              <input
                type="number"
                id="hours"
                min="0"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="minutes" className={styles.label}>Minutes</label>
              <input
                type="number"
                id="minutes"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="seconds" className={styles.label}>Seconds</label>
              <input
                type="number"
                id="seconds"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                className={styles.input}
              />
            </div>
          </div>
        ) : (
          <div className={styles.inputGroup}>
            <label htmlFor="deadlineTime" className={styles.label}>Deadline Time</label>
            <input
              type="time"
              id="deadlineTime"
              value={deadlineTime}
              onChange={(e) => setDeadlineTime(e.target.value)}
              className={styles.input}
            />
          </div>
        )}
        
        <Button
          type="submit"
          variant="primary"
          className={styles.submitButton}
          onClick={(e) => {/* Form submit is handled by onSubmit */}}
        >
          Set Time
        </Button>
      </form>
    </Card>
  );
}