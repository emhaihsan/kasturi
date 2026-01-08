'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from './useWallet';
import { createPublicClient, http } from 'viem';

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
} as const;

const publicClient = createPublicClient({
  chain: liskSepolia,
  transport: http('https://rpc.sepolia-api.lisk.com'),
});

export interface NFT {
  tokenId: string;
  contractAddress: string;
  name: string;
  description?: string;
  image?: string;
  type: 'ERC721' | 'ERC1155';
}

export function useNFTs() {
  const { address } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch NFTs from known contracts (KasturiSBT)
  const fetchNFTs = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    try {
      const kasturiSBTAddress = process.env.NEXT_PUBLIC_KASTURI_SBT_ADDRESS as `0x${string}`;
      
      if (!kasturiSBTAddress) {
        console.warn('KasturiSBT address not configured');
        return;
      }

      // Simple ERC721 balanceOf check
      const balance = await publicClient.readContract({
        address: kasturiSBTAddress,
        abi: [
          {
            inputs: [{ name: 'owner', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      });

      const nftList: NFT[] = [];

      // If user has SBTs, fetch them
      if (Number(balance) > 0) {
        // For simplicity, we'll fetch user's credentials from our API
        const response = await fetch(`/api/credentials?walletAddress=${address}`);
        if (response.ok) {
          const data = await response.json();
          
          data.credentials?.forEach((cred: any) => {
            nftList.push({
              tokenId: cred.id,
              contractAddress: kasturiSBTAddress,
              name: `${cred.programName} Certificate`,
              description: `Soulbound Token for completing ${cred.programName}`,
              image: '/icon.webp', // Default image
              type: 'ERC721',
            });
          });
        }
      }

      setNfts(nftList);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchNFTs();
    } else {
      setNfts([]);
    }
  }, [address, fetchNFTs]);

  return {
    nfts,
    loading,
    refreshNFTs: fetchNFTs,
  };
}
