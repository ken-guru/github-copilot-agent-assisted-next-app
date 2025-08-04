import { useEffect, useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { ToastMessage } from '@/types/toast';
import { BOOTSTRAP_MD_BREAKPOINT } from '@/constants/breakpoints';

/**
 * Hook that provides responsive toast messages - shorter on mobile devices
 */
export function useResponsiveToast() {
  const [isMobile, setIsMobile] = useState(false);
  const { addToast, removeToast } = useToast();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < BOOTSTRAP_MD_BREAKPOINT);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const addResponsiveToast = (options: {
    message: string;
    mobileMessage?: string;
    variant: ToastMessage['variant'];
    persistent?: boolean;
    autoDismiss?: boolean;
    duration?: number;
  }) => {
    const message = isMobile && options.mobileMessage ? options.mobileMessage : options.message;
    
    return addToast({
      message,
      variant: options.variant,
      persistent: options.persistent,
      autoDismiss: options.autoDismiss,
      duration: options.duration
    });
  };

  return {
    addResponsiveToast,
    removeToast,
    isMobile
  };
}
