import React from 'react';
import { Alert, Button } from 'react-bootstrap';

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
    <Alert 
      variant="warning" 
      className="mb-3 d-flex align-items-center justify-content-between"
      data-testid="overtime-warning"
    >
      <div className="d-flex align-items-center">
        <i className="bi bi-exclamation-triangle-fill me-2" aria-hidden="true"></i>
        <div>
          <strong>Overtime!</strong>
          <div className="small text-muted">
            {formatOvertime(timeOverage)} over planned time
          </div>
        </div>
      </div>
      {onExtendDuration && (
        <Button 
          variant="outline-warning" 
          size="sm"
          onClick={onExtendDuration}
          className="ms-2 flex-shrink-0"
          title="Add 1 minute to continue"
        >
          <i className="bi bi-plus-circle me-1"></i>
          Add 1 min
        </Button>
      )}
    </Alert>
  );
};

export default OvertimeWarning;
