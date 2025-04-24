import React, { useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { useDisplaySettings } from '../contexts/DisplaySettingsContext';
import useWakeLock from '../../hooks/useWakeLock';

const DisplayToggle: React.FC = () => {
  const { keepDisplayOn, toggleKeepDisplayOn } = useDisplaySettings();
  const { isSupported, isActive, request, release } = useWakeLock();
  
  // Effect to handle wake lock when keepDisplayOn changes
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    if (!isSupported) return;
    
    if (keepDisplayOn && !isActive) {
      request();
    } else if (!keepDisplayOn && isActive) {
      release();
    }
  }, [keepDisplayOn, isActive, isSupported, request, release]);
  
  return (
    <div className="flex items-center justify-between p-2 mt-2 bg-gray-700 rounded-md">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white">Keep Display On</span>
        {!isSupported && typeof window !== 'undefined' && (
          <span className="text-xs text-red-400">Not supported on this device</span>
        )}
      </div>
      <Switch
        checked={keepDisplayOn}
        onChange={toggleKeepDisplayOn}
        disabled={!isSupported}
        className={`${
          keepDisplayOn ? 'bg-green-600' : 'bg-gray-400'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
      >
        <span className="sr-only">Keep display on while in activities</span>
        <span
          className={`${
            keepDisplayOn ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
    </div>
  );
};

export default DisplayToggle;
