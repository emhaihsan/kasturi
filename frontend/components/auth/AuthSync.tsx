'use client';

import { useUserSync } from '@/lib/hooks/useUserSync';
import { ReactNode } from 'react';

/**
 * Component to automatically sync user authentication state
 * Place this in the root layout to ensure user data is always synced
 */
export function AuthSync({ children }: { children: ReactNode }) {
  useUserSync();
  return <>{children}</>;
}
