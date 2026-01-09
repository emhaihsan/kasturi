'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from './useWallet';
import { useWallets } from '@privy-io/react-auth';
import { CONTRACTS, KasturiTokenABI } from '@/lib/contracts';

interface FaucetStatus {
  canClaim: boolean;
  timeUntilNext: number;
  faucetAmount: number;
}

interface FaucetResult {
  success: boolean;
  txHash?: string;
  amount?: number;
  explorerUrl?: string;
  error?: string;
}

export function useFaucet() {
  const { address } = useWallet();
  const { wallets } = useWallets();
  const [faucetStatus, setFaucetStatus] = useState<FaucetStatus>({
    canClaim: false,
    timeUntilNext: 0,
    faucetAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);

  // Fetch faucet status
  const fetchFaucetStatus = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/tokens/faucet?walletAddress=${address}`);
      if (response.ok) {
        const data = await response.json();
        setFaucetStatus({
          canClaim: data.canClaim || false,
          timeUntilNext: data.timeUntilNext || 0,
          faucetAmount: data.faucetAmount || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching faucet status:', error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Claim from faucet - user calls contract directly
  const claimFaucet = useCallback(async (): Promise<FaucetResult> => {
    if (!address) {
      return { success: false, error: 'Wallet not connected' };
    }

    if (!faucetStatus.canClaim) {
      return { success: false, error: 'Faucet cooldown active' };
    }

    const wallet = wallets.find(w => w.address.toLowerCase() === address.toLowerCase());
    if (!wallet) {
      return { success: false, error: 'Wallet not available' };
    }

    setClaiming(true);
    try {
      // Get Ethereum provider from Privy wallet
      const provider = await wallet.getEthereumProvider();
      
      // User calls claimFaucet() directly on the contract
      const tx = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: CONTRACTS.KasturiToken,
          data: '0x4fe15335', // claimFaucet() function selector
        }],
      });

      console.log('✅ Faucet claim transaction sent:', tx);

      // Wait a bit then refresh
      setTimeout(() => fetchFaucetStatus(), 3000);

      return {
        success: true,
        txHash: tx as string,
        amount: faucetStatus.faucetAmount,
        explorerUrl: `https://sepolia-blockscout.lisk.com/tx/${tx}`,
      };
    } catch (error) {
      console.error('Error claiming faucet:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to claim faucet'
      };
    } finally {
      setClaiming(false);
    }
  }, [address, wallets, faucetStatus.canClaim, faucetStatus.faucetAmount, fetchFaucetStatus]);

  useEffect(() => {
    if (address) {
      fetchFaucetStatus();
      // Refresh every 30 seconds
      const interval = setInterval(fetchFaucetStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [address, fetchFaucetStatus]);

  return {
    faucetStatus,
    loading,
    claiming,
    claimFaucet,
    refreshFaucetStatus: fetchFaucetStatus,
  };
}
