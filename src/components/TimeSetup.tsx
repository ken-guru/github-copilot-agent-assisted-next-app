import { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, ButtonGroup } from 'react-bootstrap';

interface TimeSetupProps {
  onTimeSet: (durationInSeconds: number) => void;
}

export default function TimeSetup({ onTimeSet }: TimeSetupProps) {
  const [setupMode, setSetupMode] = useState<'duration' | 'deadline'>('duration');
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(1); // Default to 1 minute
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

  return (
    <Card className="mb-4" data-testid="time-setup">
      <Card.Header>
        <h5 className="mb-0">Set Time</h5>
      </Card.Header>
      
      <Card.Body>
        <ButtonGroup 
          className="w-100 mb-3" 
          role="group" 
          aria-label="Time setup mode selection"
        >
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
        
        <Form onSubmit={handleSubmit} role="form" id="time-setup-form">
          {setupMode === 'duration' ? (
            <Row className="g-3" data-testid="duration-inputs">
              <Col xs={12} md={4} data-testid="hours-input-group">
                <Form.Label htmlFor="hours">Hours</Form.Label>
                <Form.Control
                  type="number"
                  id="hours"
                  min="0"
                  value={isClient ? (hours || 0).toString() : "0"}
                  onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                />
              </Col>
              <Col xs={12} md={4} data-testid="minutes-input-group">
                <Form.Label htmlFor="minutes">Minutes</Form.Label>
                <Form.Control
                  type="number"
                  id="minutes"
                  min="0"
                  max="59"
                  value={isClient ? (minutes || 1).toString() : "1"}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                />
              </Col>
              <Col xs={12} md={4} data-testid="seconds-input-group">
                <Form.Label htmlFor="seconds">Seconds</Form.Label>
                <Form.Control
                  type="number"
                  id="seconds"
                  min="0"
                  max="59"
                  value={isClient ? (seconds || 0).toString() : "0"}
                  onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                />
              </Col>
            </Row>
          ) : (
            <div data-testid="deadline-input-group">
              <Form.Label htmlFor="deadlineTime">Deadline Time</Form.Label>
              <Form.Control
                type="time"
                id="deadlineTime"
                value={isClient ? (deadlineTime || '') : ''}
                onChange={(e) => setDeadlineTime(e.target.value || '')}
              />
            </div>
          )}
        </Form>
      </Card.Body>
      
      <Card.Footer>
        <Button
          type="submit"
          variant="success"
          className="w-100"
          form="time-setup-form"
        >
          Set Time
        </Button>
      </Card.Footer>
    </Card>
  );
}