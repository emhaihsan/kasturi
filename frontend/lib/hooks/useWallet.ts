'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createPublicClient, http, formatEther } from 'viem';
import { CONTRACTS, KasturiTokenABI } from '@/lib/contracts';

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
  tokenBalance: string;
  tokenBalanceFormatted: string;
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
    tokenBalance: '0',
    tokenBalanceFormatted: '0',
    isEmbedded: false,
    chainId: null,
    isConnected: false,
  });
  const [loading, setLoading] = useState(false);

  // Get the primary wallet based on login method
  // If user logged in with email -> use embedded wallet
  // If user logged in with external wallet -> use that wallet
  const getActiveWallet = useCallback(() => {
    if (!authenticated || !user) return null;

    if (!wallets || wallets.length === 0) return null;

    // Check how the user authenticated
    const hasEmailLogin = user.email?.address;
    const hasExternalWallet = user.wallet?.walletClientType !== 'privy';

    if (hasExternalWallet && !hasEmailLogin) {
      // User logged in with external wallet - use external wallet
      const externalWallet = wallets.find(w => w.walletClientType !== 'privy');
      if (externalWallet) return externalWallet;
    }

    // User logged in with email - use embedded wallet
    const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
    if (embeddedWallet) return embeddedWallet;

    // Fallback to first wallet
    return wallets[0];
  }, [authenticated, user, wallets]);

  // Fetch ETH balance from Lisk Sepolia
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

  // Fetch KASTURI token balance
  const fetchTokenBalance = useCallback(async (address: string) => {
    try {
      const balance = await publicClient.readContract({
        address: CONTRACTS.KasturiToken,
        abi: KasturiTokenABI,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      }) as bigint;
      
      const formatted = formatEther(balance);
      const displayFormatted = parseFloat(formatted).toFixed(0);
      
      return {
        tokenBalance: balance.toString(),
        tokenBalanceFormatted: displayFormatted,
      };
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return {
        tokenBalance: '0',
        tokenBalanceFormatted: '0',
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
          tokenBalance: '0',
          tokenBalanceFormatted: '0',
          isEmbedded: false,
          chainId: null,
          isConnected: false,
        });
        return;
      }

      const address = activeWallet.address;
      const isEmbedded = activeWallet.walletClientType === 'privy';
      
      // Fetch ETH balance and token balance in parallel
      const [ethBalanceResult, tokenBalanceResult] = await Promise.all([
        fetchBalance(address),
        fetchTokenBalance(address),
      ]);

      setWalletInfo({
        address,
        balance: ethBalanceResult.balance,
        balanceFormatted: ethBalanceResult.balanceFormatted,
        tokenBalance: tokenBalanceResult.tokenBalance,
        tokenBalanceFormatted: tokenBalanceResult.tokenBalanceFormatted,
        isEmbedded,
        chainId: 4202, // Lisk Sepolia
        isConnected: true,
      });
    } catch (error) {
      console.error('Error refreshing wallet:', error);
    } finally {
      setLoading(false);
    }
  }, [getActiveWallet, fetchBalance, fetchTokenBalance]);

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
        tokenBalance: '0',
        tokenBalanceFormatted: '0',
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
