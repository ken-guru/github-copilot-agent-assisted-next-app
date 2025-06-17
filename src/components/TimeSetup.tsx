import { useState } from 'react';
import { Form, Button, ButtonGroup, Alert, Card } from 'react-bootstrap';

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
    <Card className="mb-4" data-testid="time-setup">
      <Card.Header>
        <h2 className="h5 mb-0">Set Time</h2>
      </Card.Header>
      <Card.Body>
        <ButtonGroup className="d-flex mb-3">
          <Button 
            variant={setupMode === 'duration' ? 'primary' : 'outline-primary'}
            onClick={() => setSetupMode('duration')}
          >
            Set Duration
          </Button>
          <Button 
            variant={setupMode === 'deadline' ? 'primary' : 'outline-primary'}
            onClick={() => setSetupMode('deadline')}
          >
            Set Deadline
          </Button>
        </ButtonGroup>
        
        <Form onSubmit={handleSubmit}>
          {setupMode === 'duration' ? (
            <div className="mb-3">
              <Form.Group className="mb-2">
                <Form.Label htmlFor="hours">Hours</Form.Label>
                <Form.Control
                  id="hours"
                  type="number"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                />
              </Form.Group>
              
              <Form.Group className="mb-2">
                <Form.Label htmlFor="minutes">Minutes</Form.Label>
                <Form.Control
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label htmlFor="seconds">Seconds</Form.Label>
                <Form.Control
                  id="seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                />
              </Form.Group>
            </div>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label htmlFor="deadlineTime">Deadline Time</Form.Label>
              <Form.Control
                id="deadlineTime"
                type="time"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
              />
            </Form.Group>
          )}
          
          <div className="d-grid">
            <Button 
              type="submit" 
              variant="success"
            >
              Set Time
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}