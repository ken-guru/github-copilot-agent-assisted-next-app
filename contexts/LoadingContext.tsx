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

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export { LoadingContext };
