import 'server-only';

// Backend Wallet for server-side contract interactions
// Used for: minting tokens, issuing credentials, granting vouchers

import { createWalletClient, createPublicClient, http, parseUnits, decodeEventLog } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { 
  CONTRACTS, 
  RPC_URL, 
  KasturiTokenABI, 
  KasturiSBTABI, 
  KasturiVoucherABI 
} from './contracts';

// Lisk Sepolia chain configuration
const liskSepolia = {
  id: 4202,
  name: 'Lisk Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: [RPC_URL] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://sepolia-blockscout.lisk.com' },
  },
} as const;

// Get backend wallet from environment (same as deployer for demo)
function getBackendAccount() {
  const privateKey = process.env.BACKEND_PRIVATE_KEY || process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('BACKEND_PRIVATE_KEY or PRIVATE_KEY not set in environment');
  }
  
  // Ensure proper format
  const formattedKey = privateKey.startsWith('0x') 
    ? privateKey as `0x${string}`
    : `0x${privateKey}` as `0x${string}`;
    
  return privateKeyToAccount(formattedKey);
}

// Create wallet client for write operations
export function getBackendWallet() {
  const account = getBackendAccount();
  
  return createWalletClient({
    account,
    chain: liskSepolia,
    transport: http(RPC_URL),
  });
}

// Create public client for read operations
export function getPublicClient() {
  return createPublicClient({
    chain: liskSepolia,
    transport: http(RPC_URL),
  });
}

// ============================================================================
// Token Operations (Backend only)
// ============================================================================

/**
 * Mint tokens to user after lesson completion
 * @param userAddress User's wallet address
 * @param expAmount EXP amount for tracking
 * @param tokenAmount Token amount to mint (in wei)
 */
export async function mintTokensToUser(
  userAddress: `0x${string}`,
  expAmount: bigint,
  tokenAmount: bigint
) {
  const wallet = getBackendWallet();
  
  const hash = await wallet.writeContract({
    address: CONTRACTS.KasturiToken,
    abi: KasturiTokenABI,
    functionName: 'claimTokens',
    args: [userAddress, expAmount, tokenAmount],
  });
  
  // Wait for confirmation
  const publicClient = getPublicClient();
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  
  return {
    hash,
    status: receipt.status,
    blockNumber: receipt.blockNumber,
  };
}

/**
 * Mint tokens with EXP conversion (1 EXP = 1 Token)
 */
export async function mintTokensFromEXP(
  userAddress: `0x${string}`,
  expAmount: number
) {
  const expBigInt = BigInt(expAmount);
  const tokenAmount = parseUnits(expAmount.toString(), 18); // Convert to wei
  
  return mintTokensToUser(userAddress, expBigInt, tokenAmount);
}

// ============================================================================
// Credential Operations (Backend only)
// ============================================================================

/**
 * Issue a soulbound credential to user
 * @param userAddress User's wallet address
 * @param programId Program identifier (bytes32)
 */
export async function issueCredential(
  userAddress: `0x${string}`,
  programId: `0x${string}`
) {
  const wallet = getBackendWallet();
  
  const hash = await wallet.writeContract({
    address: CONTRACTS.KasturiSBT,
    abi: KasturiSBTABI,
    functionName: 'issueCredential',
    args: [userAddress, programId],
  });
  
  const publicClient = getPublicClient();
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  let tokenId: bigint | null = null;
  for (const log of receipt.logs) {
    try {
      const decoded = decodeEventLog({
        abi: KasturiSBTABI,
        data: log.data,
        topics: log.topics,
      });

      if (decoded.eventName === 'CredentialIssued') {
        const args = decoded.args as unknown as { tokenId: bigint };
        tokenId = args.tokenId;
        break;
      }
    } catch {
      // ignore non-matching logs
    }
  }
  
  return {
    hash,
    status: receipt.status,
    blockNumber: receipt.blockNumber,
    tokenId,
  };
}

/**
 * Set tokenURI for an issued credential tokenId
 */
export async function setCredentialTokenURI(tokenId: bigint, tokenURI: string) {
  const wallet = getBackendWallet();

  const hash = await wallet.writeContract({
    address: CONTRACTS.KasturiSBT,
    abi: KasturiSBTABI,
    functionName: 'setTokenURI',
    args: [tokenId, tokenURI],
  });

  const publicClient = getPublicClient();
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  return {
    hash,
    status: receipt.status,
    blockNumber: receipt.blockNumber,
  };
}

// ============================================================================
// Voucher Operations (Backend only)
// ============================================================================

/**
 * Grant vouchers to user (for rewards/promotions)
 * @param userAddress User's wallet address
 * @param voucherId Voucher type ID
 * @param amount Number of vouchers to grant
 */
export async function grantVoucherToUser(
  userAddress: `0x${string}`,
  voucherId: number,
  amount: number
) {
  const wallet = getBackendWallet();
  
  const hash = await wallet.writeContract({
    address: CONTRACTS.KasturiVoucher,
    abi: KasturiVoucherABI,
    functionName: 'grantVoucher',
    args: [userAddress, BigInt(voucherId), BigInt(amount)],
  });
  
  const publicClient = getPublicClient();
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  
  return {
    hash,
    status: receipt.status,
    blockNumber: receipt.blockNumber,
  };
}

// ============================================================================
// Read Operations (Can be used anywhere)
// ============================================================================

/**
 * Get user's token balance
 */
export async function getTokenBalance(userAddress: `0x${string}`) {
  const publicClient = getPublicClient();
  
  const balance = await publicClient.readContract({
    address: CONTRACTS.KasturiToken,
    abi: KasturiTokenABI,
    functionName: 'balanceOf',
    args: [userAddress],
  });
  
  return balance;
}

/**
 * Get user's claimed EXP
 */
export async function getClaimedEXP(userAddress: `0x${string}`) {
  const publicClient = getPublicClient();
  
  const exp = await publicClient.readContract({
    address: CONTRACTS.KasturiToken,
    abi: KasturiTokenABI,
    functionName: 'getClaimedEXP',
    args: [userAddress],
  });
  
  return exp;
}

/**
 * Check if user has a credential for a program
 */
export async function hasCredential(
  userAddress: `0x${string}`,
  programId: `0x${string}`
) {
  const publicClient = getPublicClient();
  
  const has = await publicClient.readContract({
    address: CONTRACTS.KasturiSBT,
    abi: KasturiSBTABI,
    functionName: 'hasCredential',
    args: [userAddress, programId],
  });
  
  return has;
}

/**
 * Get user's voucher balance
 */
export async function getVoucherBalance(
  userAddress: `0x${string}`,
  voucherId: number
) {
  const publicClient = getPublicClient();
  
  const balance = await publicClient.readContract({
    address: CONTRACTS.KasturiVoucher,
    abi: KasturiVoucherABI,
    functionName: 'balanceOf',
    args: [userAddress, BigInt(voucherId)],
  });
  
  return balance;
}
