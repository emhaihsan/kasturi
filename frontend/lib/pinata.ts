// Pinata IPFS Service for SBT and Voucher Metadata
// Uses Pinata SDK for uploading and pinning files to IPFS

import PinataClient from '@pinata/sdk';

const pinata = new PinataClient({
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretApiKey: process.env.PINATA_SECRET_KEY!,
});

// ============================================================================
// TYPES
// ============================================================================

export interface SBTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface VoucherMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

// ============================================================================
// SBT METADATA
// ============================================================================

export async function uploadSBTMetadata(
  programName: string,
  programId: string,
  userAddress: string,
  completionDate: Date
): Promise<string> {
  const metadata: SBTMetadata = {
    name: `Kasturi Certificate: ${programName}`,
    description: `This soulbound credential certifies that the holder has successfully completed the "${programName}" program on Kasturi, a decentralized language learning platform for regional Indonesian languages.`,
    image: `ipfs://bafkreiexample/kasturi-certificate.png`, // Replace with actual image
    external_url: `https://kasturi.app/verify/${userAddress}/${programId}`,
    attributes: [
      {
        trait_type: 'Program',
        value: programName,
      },
      {
        trait_type: 'Program ID',
        value: programId,
      },
      {
        trait_type: 'Completion Date',
        value: completionDate.toISOString().split('T')[0],
      },
      {
        trait_type: 'Platform',
        value: 'Kasturi',
      },
      {
        trait_type: 'Network',
        value: 'Lisk',
      },
      {
        trait_type: 'Type',
        value: 'Soulbound',
      },
    ],
  };

  const result = await pinata.pinJSONToIPFS(metadata, {
    pinataMetadata: {
      name: `kasturi-sbt-${programId}-${userAddress.slice(0, 8)}`,
    },
  });

  return `ipfs://${result.IpfsHash}`;
}

// ============================================================================
// VOUCHER METADATA
// ============================================================================

export async function uploadVoucherTypeMetadata(
  voucherId: number,
  name: string,
  description: string,
  price: number,
  imageUrl?: string
): Promise<string> {
  const metadata: VoucherMetadata = {
    name: `Kasturi Voucher: ${name}`,
    description: description || `Redeemable voucher for ${name} on Kasturi platform.`,
    image: imageUrl || `ipfs://bafkreiexample/kasturi-voucher-${voucherId}.png`,
    external_url: `https://kasturi.app/vouchers/${voucherId}`,
    attributes: [
      {
        trait_type: 'Voucher ID',
        value: voucherId,
      },
      {
        trait_type: 'Name',
        value: name,
      },
      {
        trait_type: 'Price (KSTR)',
        value: price,
      },
      {
        trait_type: 'Platform',
        value: 'Kasturi',
      },
      {
        trait_type: 'Network',
        value: 'Lisk',
      },
      {
        trait_type: 'Type',
        value: 'Utility NFT (ERC-1155)',
      },
    ],
  };

  const result = await pinata.pinJSONToIPFS(metadata, {
    pinataMetadata: {
      name: `kasturi-voucher-${voucherId}`,
    },
  });

  return `ipfs://${result.IpfsHash}`;
}

// ============================================================================
// UPLOAD IMAGE
// ============================================================================

export async function uploadImage(
  buffer: Buffer,
  filename: string
): Promise<string> {
  // For Pinata SDK, we need to use pinFileToIPFS with a readable stream
  const { Readable } = await import('stream');
  const stream = Readable.from(buffer);
  
  const result = await pinata.pinFileToIPFS(stream, {
    pinataMetadata: {
      name: filename,
    },
  });

  return `ipfs://${result.IpfsHash}`;
}

// ============================================================================
// GATEWAY URL
// ============================================================================

export function ipfsToHttpUrl(ipfsUrl: string): string {
  if (!ipfsUrl.startsWith('ipfs://')) {
    return ipfsUrl;
  }
  
  const hash = ipfsUrl.replace('ipfs://', '');
  // Use Pinata gateway or public gateway
  const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs';
  return `${gateway}/${hash}`;
}

// ============================================================================
// TEST CONNECTION
// ============================================================================

export async function testPinataConnection(): Promise<boolean> {
  try {
    await pinata.testAuthentication();
    return true;
  } catch (error) {
    console.error('Pinata connection failed:', error);
    return false;
  }
}
