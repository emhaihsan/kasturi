import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getBackendWallet, getPublicClient } from '@/lib/backend-wallet';
import { CONTRACTS, KasturiTokenABI } from '@/lib/contracts';

// POST /api/tokens/faucet - Claim free tokens from faucet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    console.log('🚰 Faucet claim request:', { walletAddress });

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user can claim from faucet (on-chain check)
    const publicClient = getPublicClient();
    const canClaim = await publicClient.readContract({
      address: CONTRACTS.KasturiToken,
      abi: KasturiTokenABI,
      functionName: 'canClaimFaucet',
      args: [walletAddress.toLowerCase() as `0x${string}`],
    });

    if (!canClaim) {
      // Get time until next claim
      const timeUntilNext = await publicClient.readContract({
        address: CONTRACTS.KasturiToken,
        abi: KasturiTokenABI,
        functionName: 'timeUntilNextClaim',
        args: [walletAddress.toLowerCase() as `0x${string}`],
      });

      const hours = Number(timeUntilNext) / 3600;
      return NextResponse.json(
        { 
          error: `Faucet cooldown active. Try again in ${hours.toFixed(1)} hours.`,
          timeUntilNext: Number(timeUntilNext),
        },
        { status: 400 }
      );
    }

    // Return faucet info - user will claim directly from frontend
    // claimFaucet() mints to msg.sender, so user must call it themselves
    const faucetAmount = await publicClient.readContract({
      address: CONTRACTS.KasturiToken,
      abi: KasturiTokenABI,
      functionName: 'faucetAmount',
    });

    return NextResponse.json({
      success: true,
      canClaim: true,
      amount: Number(faucetAmount) / 1e18,
      message: 'Ready to claim from faucet',
    });
  } catch (error) {
    console.error('❌ Error claiming faucet:', error);
    return NextResponse.json(
      { error: 'Failed to claim faucet: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

// GET /api/tokens/faucet - Check faucet status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      );
    }

    const publicClient = getPublicClient();
    
    const canClaim = await publicClient.readContract({
      address: CONTRACTS.KasturiToken,
      abi: KasturiTokenABI,
      functionName: 'canClaimFaucet',
      args: [walletAddress.toLowerCase() as `0x${string}`],
    });

    const timeUntilNext = await publicClient.readContract({
      address: CONTRACTS.KasturiToken,
      abi: KasturiTokenABI,
      functionName: 'timeUntilNextClaim',
      args: [walletAddress.toLowerCase() as `0x${string}`],
    });

    const faucetAmount = await publicClient.readContract({
      address: CONTRACTS.KasturiToken,
      abi: KasturiTokenABI,
      functionName: 'faucetAmount',
    });

    return NextResponse.json({
      canClaim,
      timeUntilNext: Number(timeUntilNext),
      faucetAmount: Number(faucetAmount) / 1e18,
    });
  } catch (error) {
    console.error('Error checking faucet status:', error);
    return NextResponse.json(
      { error: 'Failed to check faucet status' },
      { status: 500 }
    );
  }
}
