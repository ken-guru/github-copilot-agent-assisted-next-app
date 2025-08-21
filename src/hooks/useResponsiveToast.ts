import { useCallback, useEffect, useMemo, useState, useContext } from 'react';
import { ToastContext } from '@/contexts/ToastContext';
import { ToastContextType } from '@/types/toast';
import { ToastMessage } from '@/types/toast';
import { BOOTSTRAP_MD_BREAKPOINT } from '@/constants/breakpoints';

/**
 * Hook that provides responsive toast messages - shorter on mobile devices
 */
export function useResponsiveToast() {
  // Initialize responsively but remain SSR-safe
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < BOOTSTRAP_MD_BREAKPOINT;
  });
  // Access toast context safely (tests may render without provider)
  const toastCtx = useContext(ToastContext);

  // Memoize toast functions so they are stable for hook dependencies
  const addToast = useMemo<ToastContextType['addToast']>(() => {
    return toastCtx?.addToast ?? (() => '');
  }, [toastCtx]);

  const removeToast = useMemo<ToastContextType['removeToast']>(() => {
    return toastCtx?.removeToast ?? (() => {});
  }, [toastCtx]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkIsMobile = () => setIsMobile(window.innerWidth < BOOTSTRAP_MD_BREAKPOINT);
    // Initialize
    checkIsMobile();
    // Always attach resize listener (tests rely on this and it's broadly supported)
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const addResponsiveToast = useCallback((options: {
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
  }, [isMobile, addToast]);

  return {
    addResponsiveToast,
    removeToast,
    isMobile
  };
}
