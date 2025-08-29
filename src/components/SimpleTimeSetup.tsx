import React, { useState } from 'react';

interface SimpleTimeSetupProps {
  onTimeSet: (durationInSeconds: number) => void;
}

export default function SimpleTimeSetup({ onTimeSet }: SimpleTimeSetupProps) {
  const [hours, setHours] = useState<number>(0);

  return (
    <div data-testid="simple-time-setup">
      <input
        type="number"
        value={hours}
        onChange={(e) => setHours(parseInt(e.target.value) || 0)}
        data-testid="hours-input"
      />
      <button onClick={() => onTimeSet(hours * 3600)}>Set Time</button>
    </div>
  );
}