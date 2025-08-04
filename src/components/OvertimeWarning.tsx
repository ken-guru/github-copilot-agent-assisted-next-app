import React from 'react';
import { InputGroup, Button } from 'react-bootstrap';

interface OvertimeWarningProps {
  onExtendDuration?: () => void;
  timeOverage: number; // Time in seconds over the limit
}

const OvertimeWarning: React.FC<OvertimeWarningProps> = ({ 
  onExtendDuration, 
  timeOverage 
}) => {
  const formatOvertime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <div className="mb-3" data-testid="overtime-warning" role="alert">
      <InputGroup>
        <div className="form-control d-flex align-items-center text-warning">
          <i className="bi bi-exclamation-triangle-fill me-2" aria-hidden="true"></i>
          <strong>Overtime by {formatOvertime(timeOverage)}</strong>
        </div>
        {onExtendDuration && (
          <Button 
            variant="outline-primary"
            onClick={onExtendDuration}
            title="Add 1 minute to continue"
          >
            <i className="bi bi-plus-circle me-1"></i>
            Add 1 min
          </Button>
        )}
      </InputGroup>
    </div>
  );
};

export default OvertimeWarning;
