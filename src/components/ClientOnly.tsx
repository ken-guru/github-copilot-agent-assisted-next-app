'use client';
import { ReactNode, ReactElement } from 'react';
import { useIsClient } from '@/hooks/useIsClient';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ClientOnly({ children, fallback = null }: ClientOnlyProps): ReactElement | null {
  const hasMounted = useIsClient();

  if (!hasMounted) {
    return fallback as ReactElement | null;
  }

  return children as ReactElement | null;
}
