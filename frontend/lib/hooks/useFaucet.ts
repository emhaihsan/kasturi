'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from './useWallet';

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

  // Claim from faucet - GASLESS via backend API
  const claimFaucet = useCallback(async (): Promise<FaucetResult> => {
    if (!address) {
      return { success: false, error: 'Wallet not connected' };
    }

    if (!faucetStatus.canClaim) {
      return { success: false, error: 'Faucet cooldown active' };
    }

    setClaiming(true);
    try {
      const response = await fetch('/api/tokens/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Faucet claim failed' };
      }

      // Refresh faucet status after successful claim
      await fetchFaucetStatus();

      return {
        success: true,
        txHash: data.txHash,
        amount: data.amount,
        explorerUrl: data.explorerUrl,
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
  }, [address, faucetStatus.canClaim, fetchFaucetStatus]);

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
