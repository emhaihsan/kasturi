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
        const errorText = await response.text();
        console.error('Failed to fetch credentials:', response.status, errorText);
        setNfts([]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      const nftList: NFT[] = [];
      
      // Fetch metadata for each credential if metadataUrl exists
      for (const cred of data.credentials || []) {
        let image = '/icon.webp';
        let name = `${cred.programName} Certificate`;
        let description = `Soulbound Token for completing ${cred.programName}`;

        // Try to fetch metadata from IPFS if available
        if (cred.metadataUrl) {
          try {
            const metadataUrl = cred.metadataUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
            const metaResponse = await fetch(metadataUrl);
            if (metaResponse.ok) {
              const metadata = await metaResponse.json();
              if (metadata.name) name = metadata.name;
              if (metadata.description) description = metadata.description;
              if (metadata.image) {
                image = metadata.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
              }
            }
          } catch (e) {
            console.error('Failed to fetch NFT metadata:', e);
          }
        }

        nftList.push({
          tokenId: cred.id,
          contractAddress: KASTURI_SBT_ADDRESS,
          name,
          description,
          image,
          txHash: cred.txHash,
          issuedAt: cred.issuedAt,
          type: 'ERC721',
        });
      }

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
