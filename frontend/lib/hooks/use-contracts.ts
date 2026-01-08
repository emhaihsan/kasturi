'use client';

import { useState, useCallback } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createPublicClient, createWalletClient, http, custom, formatEther, parseEther } from 'viem';
import { liskSepolia } from 'viem/chains';
import KasturiTokenABI from '@/lib/abis/KasturiToken.json';
import KasturiSBTABI from '@/lib/abis/KasturiSBT.json';
import KasturiVoucherABI from '@/lib/abis/KasturiVoucher.json';

const KASTURI_TOKEN = process.env.NEXT_PUBLIC_KASTURI_TOKEN as `0x${string}`;
const KASTURI_SBT = process.env.NEXT_PUBLIC_KASTURI_SBT as `0x${string}`;
const KASTURI_VOUCHER = process.env.NEXT_PUBLIC_KASTURI_VOUCHER as `0x${string}`;

export function useContracts() {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publicClient = createPublicClient({
    chain: liskSepolia,
    transport: http(process.env.NEXT_PUBLIC_LISK_RPC_URL),
  });

  const getWalletClient = useCallback(async () => {
    if (!wallets.length) throw new Error('No wallet connected');
    
    const wallet = wallets[0];
    const provider = await wallet.getEthereumProvider();
    
    return createWalletClient({
      chain: liskSepolia,
      transport: custom(provider),
      account: wallet.address as `0x${string}`,
    });
  }, [wallets]);

  // ============================================================================
  // TOKEN FUNCTIONS
  // ============================================================================

  const getTokenBalance = useCallback(async (address: string) => {
    try {
      const balance = await publicClient.readContract({
        address: KASTURI_TOKEN,
        abi: KasturiTokenABI.abi,
        functionName: 'balanceOf',
        args: [address],
      }) as bigint;
      return formatEther(balance);
    } catch (e) {
      console.error('Failed to get balance:', e);
      return '0';
    }
  }, [publicClient]);

  const claimFaucet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const walletClient = await getWalletClient();
      const address = walletClient.account?.address;
      if (!address) throw new Error('No wallet address');

      const hash = await walletClient.writeContract({
        address: KASTURI_TOKEN,
        abi: KasturiTokenABI.abi,
        functionName: 'claimFaucet',
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      return { hash, status: receipt.status };
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [getWalletClient, publicClient]);

  const canClaimFaucet = useCallback(async (address: string) => {
    try {
      return await publicClient.readContract({
        address: KASTURI_TOKEN,
        abi: KasturiTokenABI.abi,
        functionName: 'canClaimFaucet',
        args: [address],
      }) as boolean;
    } catch (e) {
      return false;
    }
  }, [publicClient]);

  // ============================================================================
  // SBT FUNCTIONS
  // ============================================================================

  const hasCredential = useCallback(async (address: string, programId: string) => {
    try {
      return await publicClient.readContract({
        address: KASTURI_SBT,
        abi: KasturiSBTABI.abi,
        functionName: 'hasCredential',
        args: [address, programId],
      }) as boolean;
    } catch (e) {
      return false;
    }
  }, [publicClient]);

  const getCredentialCount = useCallback(async (address: string) => {
    try {
      return await publicClient.readContract({
        address: KASTURI_SBT,
        abi: KasturiSBTABI.abi,
        functionName: 'balanceOf',
        args: [address],
      }) as bigint;
    } catch (e) {
      return 0n;
    }
  }, [publicClient]);

  // ============================================================================
  // VOUCHER FUNCTIONS
  // ============================================================================

  const getVoucherBalance = useCallback(async (address: string, voucherId: number) => {
    try {
      return await publicClient.readContract({
        address: KASTURI_VOUCHER,
        abi: KasturiVoucherABI.abi,
        functionName: 'balanceOf',
        args: [address, BigInt(voucherId)],
      }) as bigint;
    } catch (e) {
      return 0n;
    }
  }, [publicClient]);

  const purchaseVoucher = useCallback(async (voucherId: number, amount: number) => {
    setLoading(true);
    setError(null);
    try {
      const walletClient = await getWalletClient();
      const address = walletClient.account?.address;
      if (!address) throw new Error('No wallet address');

      // Get voucher price
      const [, price] = await publicClient.readContract({
        address: KASTURI_VOUCHER,
        abi: KasturiVoucherABI.abi,
        functionName: 'getVoucherType',
        args: [BigInt(voucherId)],
      }) as [string, bigint, boolean];

      const totalPrice = price * BigInt(amount);

      // First approve tokens
      const approveHash = await walletClient.writeContract({
        address: KASTURI_TOKEN,
        abi: KasturiTokenABI.abi,
        functionName: 'approve',
        args: [KASTURI_VOUCHER, totalPrice],
      });
      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      // Then purchase
      const hash = await walletClient.writeContract({
        address: KASTURI_VOUCHER,
        abi: KasturiVoucherABI.abi,
        functionName: 'purchaseVoucher',
        args: [BigInt(voucherId), BigInt(amount)],
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      return { hash, status: receipt.status };
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [getWalletClient, publicClient]);

  const redeemVoucher = useCallback(async (voucherId: number, amount: number) => {
    setLoading(true);
    setError(null);
    try {
      const walletClient = await getWalletClient();

      const hash = await walletClient.writeContract({
        address: KASTURI_VOUCHER,
        abi: KasturiVoucherABI.abi,
        functionName: 'redeemVoucher',
        args: [BigInt(voucherId), BigInt(amount)],
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      return { hash, status: receipt.status };
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [getWalletClient, publicClient]);

  return {
    ready,
    authenticated,
    loading,
    error,
    // Token
    getTokenBalance,
    claimFaucet,
    canClaimFaucet,
    // SBT
    hasCredential,
    getCredentialCount,
    // Voucher
    getVoucherBalance,
    purchaseVoucher,
    redeemVoucher,
  };
}
