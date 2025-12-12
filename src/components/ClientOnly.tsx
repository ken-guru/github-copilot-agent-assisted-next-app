'use client';
import { useState, useEffect, ReactNode, ReactElement } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ClientOnly({ children, fallback = null }: ClientOnlyProps): ReactElement | null {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // This is a legitimate SSR hydration pattern - setting state on mount
    // to avoid hydration mismatches between server and client
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback as ReactElement | null;
  }

  return children as ReactElement | null;
}
