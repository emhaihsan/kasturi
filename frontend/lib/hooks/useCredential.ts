'use client';

import { useState, useCallback } from 'react';
import { useWallet } from './useWallet';

export interface CredentialInfo {
  id: string;
  programId: string;
  programName: string;
  txHash: string;
  metadataUri?: string;
}

export interface ClaimResult {
  success: boolean;
  credential?: CredentialInfo;
  error?: string;
}

export function useCredential() {
  const { address } = useWallet();
  const [claiming, setClaiming] = useState(false);
  const [lastClaim, setLastClaim] = useState<ClaimResult | null>(null);

  /**
   * Claim credential for completing a program
   * This is GASLESS - backend handles all blockchain transactions
   */
  const claimCredential = useCallback(async (programId: string): Promise<ClaimResult> => {
    if (!address) {
      return { success: false, error: 'Wallet not connected' };
    }

    setClaiming(true);
    setLastClaim(null);

    try {
      const response = await fetch('/api/credentials/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          programId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const result = { 
          success: false, 
          error: data.error || 'Failed to claim credential',
        };
        setLastClaim(result);
        return result;
      }

      const result: ClaimResult = {
        success: true,
        credential: data.credential,
      };
      
      setLastClaim(result);
      return result;
    } catch (error) {
      console.error('Error claiming credential:', error);
      const result = { 
        success: false, 
        error: 'Network error. Please try again.',
      };
      setLastClaim(result);
      return result;
    } finally {
      setClaiming(false);
    }
  }, [address]);

  /**
   * Check if user has credential for a program
   * Returns { hasCredential, txHash, issuedAt } 
   */
  const checkCredential = useCallback(async (programId: string): Promise<{
    hasCredential: boolean;
    txHash?: string;
    issuedAt?: string;
  }> => {
    if (!address) return { hasCredential: false };

    try {
      const response = await fetch(
        `/api/credentials/check?walletAddress=${address}&programId=${programId}`
      );
      
      if (!response.ok) return { hasCredential: false };
      
      const data = await response.json();
      return {
        hasCredential: data.hasCredential,
        txHash: data.credential?.txHash,
        issuedAt: data.credential?.issuedAt,
      };
    } catch (error) {
      console.error('Error checking credential:', error);
      return { hasCredential: false };
    }
  }, [address]);

  /**
   * Get user's credentials
   */
  const getCredentials = useCallback(async (): Promise<CredentialInfo[]> => {
    if (!address) return [];

    try {
      const response = await fetch(`/api/credentials?walletAddress=${address}`);
      
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.credentials || [];
    } catch (error) {
      console.error('Error fetching credentials:', error);
      return [];
    }
  }, [address]);

  return {
    claiming,
    lastClaim,
    claimCredential,
    checkCredential,
    getCredentials,
  };
}
