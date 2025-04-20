import { useContext } from 'react';
import { LoadingContext, LoadingContextType } from './LoadingContext';

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  
  return context;
};
