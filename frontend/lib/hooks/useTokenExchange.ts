'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from './useWallet';

interface ExpStatus {
  totalExp: number;
  claimedExp: number;
  availableExp: number;
}

interface ExchangeResult {
  success: boolean;
  txHash?: string;
  expExchanged?: number;
  tokensReceived?: number;
  explorerUrl?: string;
  error?: string;
}

export function useTokenExchange() {
  const { address } = useWallet();
  const [expStatus, setExpStatus] = useState<ExpStatus>({
    totalExp: 0,
    claimedExp: 0,
    availableExp: 0,
  });
  const [loading, setLoading] = useState(false);
  const [exchanging, setExchanging] = useState(false);

  // Fetch EXP status
  const fetchExpStatus = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/tokens/exchange?walletAddress=${address}`);
      if (response.ok) {
        const data = await response.json();
        setExpStatus({
          totalExp: data.totalExp || 0,
          claimedExp: data.claimedExp || 0,
          availableExp: data.availableExp || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching EXP status:', error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Exchange EXP for tokens
  const exchangeExpForTokens = useCallback(async (expAmount: number): Promise<ExchangeResult> => {
    if (!address) {
      return { success: false, error: 'Wallet not connected' };
    }

    if (expAmount <= 0) {
      return { success: false, error: 'Invalid amount' };
    }

    if (expAmount > expStatus.availableExp) {
      return { success: false, error: `Insufficient EXP. Available: ${expStatus.availableExp}` };
    }

    setExchanging(true);
    try {
      const response = await fetch('/api/tokens/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          expAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Exchange failed' };
      }

      // Refresh EXP status after successful exchange
      await fetchExpStatus();

      return {
        success: true,
        txHash: data.txHash,
        expExchanged: data.expExchanged,
        tokensReceived: data.tokensReceived,
        explorerUrl: data.explorerUrl,
      };
    } catch (error) {
      console.error('Error exchanging tokens:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setExchanging(false);
    }
  }, [address, expStatus.availableExp, fetchExpStatus]);

  useEffect(() => {
    if (address) {
      fetchExpStatus();
    }
  }, [address, fetchExpStatus]);

  return {
    expStatus,
    loading,
    exchanging,
    exchangeExpForTokens,
    refreshExpStatus: fetchExpStatus,
  };
}
