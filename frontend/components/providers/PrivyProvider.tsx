'use client';

import { PrivyProvider as PrivyAuthProvider } from '@privy-io/react-auth';
import { ReactNode } from 'react';

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'clxxxxxxxxxxxxxxxxxx';

// Lisk Sepolia chain configuration
const liskSepolia = {
  id: 4202,
  name: 'Lisk Sepolia',
  network: 'lisk-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia-api.lisk.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://sepolia-blockscout.lisk.com',
    },
  },
  testnet: true,
};

export function PrivyProvider({ children }: { children: ReactNode }) {
  return (
    <PrivyAuthProvider
      appId={PRIVY_APP_ID}
      config={{
        // Only allow email and wallet login
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#10b981',
          logo: '/icon.webp',
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          // Auto-create embedded wallet for email users
          createOnLogin: 'users-without-wallets',
        },
        // Set default chain to Lisk Sepolia
        defaultChain: liskSepolia,
        supportedChains: [liskSepolia],
      }}
    >
      {children}
    </PrivyAuthProvider>
  );
}
