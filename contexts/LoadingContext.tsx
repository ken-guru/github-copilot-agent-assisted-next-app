import React, { createContext, useState, useContext, ReactNode, Context } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadingContext: Context<LoadingContextType | undefined> = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
  initialLoadingState?: boolean;
}

export const LoadingProvider = ({ 
  children, 
  initialLoadingState = true 
}: LoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(initialLoadingState);
  
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export { LoadingContext };
