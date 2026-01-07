'use client';

import { PrivyProvider as PrivyAuthProvider } from '@privy-io/react-auth';
import { ReactNode } from 'react';

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'clxxxxxxxxxxxxxxxxxx';

export function PrivyProvider({ children }: { children: ReactNode }) {
  return (
    <PrivyAuthProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['email', 'google', 'twitter', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#10b981',
          logo: '/icon.webp',
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyAuthProvider>
  );
}
