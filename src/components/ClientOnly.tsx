'use client';
import { useState, useEffect, useRef, ReactNode, ReactElement } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ClientOnly({ children, fallback = null }: ClientOnlyProps): ReactElement | null {
  const [hasMounted, setHasMounted] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    // Use ref to track if we've already updated to avoid unnecessary re-renders
    if (!mountedRef.current) {
      mountedRef.current = true;
      // Queue a microtask to update state asynchronously
      queueMicrotask(() => {
        setHasMounted(true);
      });
    }
  }, []);

  if (!hasMounted) {
    return fallback as ReactElement | null;
  }

  return children as ReactElement | null;
}
