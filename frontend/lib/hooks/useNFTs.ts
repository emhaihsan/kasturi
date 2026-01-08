'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from './useWallet';

// Contract address from env
const KASTURI_SBT_ADDRESS = process.env.NEXT_PUBLIC_KASTURI_SBT || '0x994275a953074accf218c9b5b77ea55cef00d17b';

export interface NFT {
  tokenId: string;
  contractAddress: string;
  name: string;
  description?: string;
  image?: string;
  txHash?: string;
  issuedAt?: string;
  type: 'ERC721' | 'ERC1155';
}

export function useNFTs() {
  const { address } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch NFTs from our database API (more reliable than on-chain query)
  const fetchNFTs = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    try {
      // Fetch credentials from our API
      const response = await fetch(`/api/credentials?walletAddress=${address}`);
      
      if (!response.ok) {
        console.error('Failed to fetch credentials');
        setNfts([]);
        return;
      }

      const data = await response.json();
      const nftList: NFT[] = [];
      
      data.credentials?.forEach((cred: any) => {
        nftList.push({
          tokenId: cred.id,
          contractAddress: KASTURI_SBT_ADDRESS,
          name: `${cred.programName} Certificate`,
          description: `Soulbound Token for completing ${cred.programName}`,
          image: '/icon.webp',
          txHash: cred.txHash,
          issuedAt: cred.issuedAt,
          type: 'ERC721',
        });
      });

      setNfts(nftList);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      setNfts([]);
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
