import { useState, useEffect } from 'react';
// Import Material 3 components instead of Bootstrap
import Material3Card from '@/design-system/components/Card';
import Material3Input from '@/design-system/components/Input';
import Material3Button from '@/design-system/components/Button';
import { getResponsiveSpacing } from '@/design-system/utils/mobile-touch';

interface TimeSetupProps {
  onTimeSet: (durationInSeconds: number) => void;
}

export default function TimeSetup({ onTimeSet }: TimeSetupProps) {
  const [setupMode, setSetupMode] = useState<'duration' | 'deadline'>('duration');
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0); // Allow zero minutes
  const [seconds, setSeconds] = useState<number>(0);
  const [deadlineTime, setDeadlineTime] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by only running time calculations on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only calculate time on the client to prevent hydration mismatch
    if (!isClient) return;
    
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

  // Get responsive spacing for mobile optimization
  const cardSpacing = getResponsiveSpacing('md');
  const formSpacing = getResponsiveSpacing('sm');
  const buttonSpacing = getResponsiveSpacing('lg');

  return (
    <Material3Card className="w-full max-w-md" data-testid="time-setup">
      <div className={`${cardSpacing.padding}`}>
        <h5 className={`text-lg font-medium ${formSpacing.margin}b-6`}>Set Time</h5>
        
        {/* Material 3 Segmented Button Group for mode selection */}
        <div 
          className={`flex bg-surface-container-highest rounded-full p-1 ${formSpacing.margin}b-6`}
          role="group" 
          aria-label="Time setup mode selection"
        >
          <Material3Button
            variant={setupMode === 'duration' ? 'filled' : 'text'}
            onClick={() => setSetupMode('duration')}
            className="flex-1 rounded-full"
          >
            Set Duration
          </Material3Button>
          <Material3Button
            variant={setupMode === 'deadline' ? 'filled' : 'text'}
            onClick={() => setSetupMode('deadline')}
            className="flex-1 rounded-full"
          >
            Set Deadline
          </Material3Button>
        </div>
        
        <form onSubmit={handleSubmit} role="form" id="time-setup-form">
          {setupMode === 'duration' ? (
            <div className={`grid grid-cols-1 md:grid-cols-3 ${formSpacing.gap}`} data-testid="duration-inputs">
              <div data-testid="hours-input-group">
                <Material3Input
                  type="number"
                  id="hours"
                  label="Hours"
                  min={0}
                  value={isClient ? hours.toString() : "0"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const parsedValue = parseInt(e.target.value, 10);
                    setHours(isNaN(parsedValue) ? 0 : parsedValue);
                  }}
                  fullWidth
                />
              </div>
              <div data-testid="minutes-input-group">
                <Material3Input
                  type="number"
                  id="minutes"
                  label="Minutes"
                  min={0}
                  max={59}
                  value={isClient ? minutes.toString() : "0"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = parseInt(e.target.value, 10);
                    setMinutes(isNaN(value) ? 0 : value);
                  }}
                  fullWidth
                />
              </div>
              <div data-testid="seconds-input-group">
                <Material3Input
                  type="number"
                  id="seconds"
                  label="Seconds"
                  min={0}
                  max={59}
                  value={isClient ? seconds.toString() : "0"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = parseInt(e.target.value, 10);
                    setSeconds(isNaN(value) ? 0 : value);
                  }}
                  fullWidth
                />
              </div>
            </div>
          ) : (
            <div data-testid="deadline-input-group">
              <Material3Input
                type="time"
                id="deadlineTime"
                label="Deadline Time"
                value={isClient ? (deadlineTime || '') : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeadlineTime(e.target.value || '')}
                fullWidth
              />
            </div>
          )}
        </form>
        
        {/* Submit button */}
        <div className={`${buttonSpacing.margin}t-6`}>
          <Material3Button
            type="submit"
            variant="filled"
            form="time-setup-form"
            fullWidth
          >
            Set Time
          </Material3Button>
        </div>
      </div>
    </Material3Card>
  );
}