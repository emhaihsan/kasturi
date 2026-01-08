import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { liskSepolia } from 'viem/chains';
import KasturiTokenABI from '@/lib/abis/KasturiToken.json';

const KASTURI_TOKEN = process.env.NEXT_PUBLIC_KASTURI_TOKEN as `0x${string}`;

// POST /api/faucet - Claim tokens from faucet (user-initiated)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      );
    }

    const publicClient = createPublicClient({
      chain: liskSepolia,
      transport: http(process.env.NEXT_PUBLIC_LISK_RPC_URL),
    });

    // Check if faucet is enabled and user can claim
    const [faucetEnabled, faucetAmount, canClaim] = await Promise.all([
      publicClient.readContract({
        address: KASTURI_TOKEN,
        abi: KasturiTokenABI.abi,
        functionName: 'faucetEnabled',
      }),
      publicClient.readContract({
        address: KASTURI_TOKEN,
        abi: KasturiTokenABI.abi,
        functionName: 'faucetAmount',
      }),
      publicClient.readContract({
        address: KASTURI_TOKEN,
        abi: KasturiTokenABI.abi,
        functionName: 'canClaimFaucet',
        args: [walletAddress],
      }),
    ]);

    if (!faucetEnabled) {
      return NextResponse.json(
        { error: 'Faucet is currently disabled' },
        { status: 400 }
      );
    }

    if (!canClaim) {
      return NextResponse.json(
        { error: 'You cannot claim from faucet yet. Please wait for cooldown.' },
        { status: 400 }
      );
    }

    // Return instructions for user to claim directly
    // The user's wallet will sign and send the transaction
    return NextResponse.json({
      success: true,
      canClaim: true,
      faucetAmount: faucetAmount?.toString(),
      message: 'Use your wallet to call claimFaucet() on the contract',
      contract: KASTURI_TOKEN,
    });
  } catch (error) {
    console.error('Error checking faucet:', error);
    return NextResponse.json(
      { error: 'Failed to check faucet status' },
      { status: 500 }
    );
  }
}
