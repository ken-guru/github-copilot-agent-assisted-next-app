import React from 'react';

interface OvertimeWarningProps {
  onExtendDuration?: () => void;
  timeOverage: number; // Time in seconds over the limit
}

const OvertimeWarning: React.FC<OvertimeWarningProps> = ({ 
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
    <div 
      className="mb-3 p-2 border border-warning rounded bg-warning-subtle d-flex align-items-center"
      data-testid="overtime-warning" 
      role="alert"
      style={{ minHeight: '38px' }} // Match input height
    >
      <i className="bi bi-exclamation-triangle-fill me-2 text-warning" aria-hidden="true"></i>
      <small className="text-warning-emphasis mb-0">
        <strong>Overtime by {formatOvertime(timeOverage)}</strong>
      </small>
    </div>
  );
};

export default OvertimeWarning;
