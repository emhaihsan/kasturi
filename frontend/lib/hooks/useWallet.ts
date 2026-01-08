'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createPublicClient, http, formatEther } from 'viem';

// Lisk Sepolia chain
const liskSepolia = {
  id: 4202,
  name: 'Lisk Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia-api.lisk.com'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://sepolia-blockscout.lisk.com' },
  },
} as const;

// Create public client for Lisk Sepolia
const publicClient = createPublicClient({
  chain: liskSepolia,
  transport: http('https://rpc.sepolia-api.lisk.com'),
});

export interface WalletInfo {
  address: string | null;
  balance: string;
  balanceFormatted: string;
  isEmbedded: boolean;
  chainId: number | null;
  isConnected: boolean;
}

export function useWallet() {
  const { authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    address: null,
    balance: '0',
    balanceFormatted: '0.0000',
    isEmbedded: false,
    chainId: null,
    isConnected: false,
  });
  const [loading, setLoading] = useState(false);

  // Get the primary wallet (embedded or external)
  const getActiveWallet = useCallback(() => {
    if (!authenticated || !user) return null;

    // First check for connected wallets from useWallets
    if (wallets && wallets.length > 0) {
      // Prefer embedded wallet for seamless UX
      const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
      if (embeddedWallet) return embeddedWallet;
      
      // Otherwise use first wallet
      return wallets[0];
    }

    return null;
  }, [authenticated, user, wallets]);

  // Fetch balance from Lisk Sepolia
  const fetchBalance = useCallback(async (address: string) => {
    try {
      const balance = await publicClient.getBalance({
        address: address as `0x${string}`,
      });
      
      const formatted = formatEther(balance);
      const displayFormatted = parseFloat(formatted).toFixed(4);
      
      return {
        balance: balance.toString(),
        balanceFormatted: displayFormatted,
      };
    } catch (error) {
      console.error('Error fetching balance:', error);
      return {
        balance: '0',
        balanceFormatted: '0.0000',
      };
    }
  }, []);

  // Refresh wallet info
  const refreshWallet = useCallback(async () => {
    setLoading(true);
    
    try {
      const activeWallet = getActiveWallet();
      
      if (!activeWallet) {
        setWalletInfo({
          address: null,
          balance: '0',
          balanceFormatted: '0.0000',
          isEmbedded: false,
          chainId: null,
          isConnected: false,
        });
        return;
      }

      const address = activeWallet.address;
      const isEmbedded = activeWallet.walletClientType === 'privy';
      
      // Fetch balance
      const { balance, balanceFormatted } = await fetchBalance(address);

      setWalletInfo({
        address,
        balance,
        balanceFormatted,
        isEmbedded,
        chainId: 4202, // Lisk Sepolia
        isConnected: true,
      });
    } catch (error) {
      console.error('Error refreshing wallet:', error);
    } finally {
      setLoading(false);
    }
  }, [getActiveWallet, fetchBalance]);

  // Auto-refresh on auth change
  useEffect(() => {
    if (authenticated) {
      // Small delay to let wallet initialize
      const timer = setTimeout(() => {
        refreshWallet();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setWalletInfo({
        address: null,
        balance: '0',
        balanceFormatted: '0.0000',
        isEmbedded: false,
        chainId: null,
        isConnected: false,
      });
    }
  }, [authenticated, wallets, refreshWallet]);

  // Get explorer URL for address or tx
  const getExplorerUrl = useCallback((hashOrAddress: string, type: 'address' | 'tx' = 'address') => {
    return `https://sepolia-blockscout.lisk.com/${type}/${hashOrAddress}`;
  }, []);

  return {
    ...walletInfo,
    loading,
    refreshWallet,
    getExplorerUrl,
  };
}
