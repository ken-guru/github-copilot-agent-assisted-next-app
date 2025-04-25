import React, { createContext, useContext, useState, useEffect } from 'react';

interface DisplaySettingsContextType {
  keepDisplayOn: boolean;
  toggleKeepDisplayOn: () => void;
}

// Default context value - must be the same on server and client for initial render
const defaultContextValue: DisplaySettingsContextType = {
  keepDisplayOn: false,
  toggleKeepDisplayOn: () => {},
};

const DisplaySettingsContext = createContext<DisplaySettingsContextType>(defaultContextValue);

export const useDisplaySettings = (): DisplaySettingsContextType => {
  const context = useContext(DisplaySettingsContext);
  
  if (!context) {
    throw new Error('useDisplaySettings must be used within a DisplaySettingsProvider');
  }
  
  return context;
};

interface DisplaySettingsProviderProps {
  children: React.ReactNode;
}

export const DisplaySettingsProvider: React.FC<DisplaySettingsProviderProps> = ({ children }) => {
  // Always initialize with the default value to ensure SSR matches initial client render
  const [keepDisplayOn, setKeepDisplayOn] = useState<boolean>(false);
  
  // Use a ref to track if we're in the first client render after hydration
  const isInitialClientRender = React.useRef(true);
  
  // Only run on client-side and after the component has mounted
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // This will only run on the client, after hydration is complete
      const savedPreference = localStorage.getItem('keepDisplayOn');
      if (savedPreference !== null) {
        setKeepDisplayOn(savedPreference === 'true');
      }
      
      // Mark initial render complete
      isInitialClientRender.current = false;
    }
    
    // Run only once on mount
  }, []);
  
  // Save to localStorage when value changes, but only after the initial render
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialClientRender.current) {
      localStorage.setItem('keepDisplayOn', String(keepDisplayOn));
    }
  }, [keepDisplayOn]);
  
  const toggleKeepDisplayOn = () => {
    setKeepDisplayOn(prev => !prev);
  };
  
  const value = {
    keepDisplayOn,
    toggleKeepDisplayOn,
  };
  
  return (
    <DisplaySettingsContext.Provider value={value}>
      {children}
    </DisplaySettingsContext.Provider>
  );
};
