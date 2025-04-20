import { useContext } from 'react';
import { LoadingContext } from './LoadingContext';

export const useLoading = (): LoadingContext => {
  const context = useContext(LoadingContext);
  
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  
  return context;
};
