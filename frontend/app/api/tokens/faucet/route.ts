import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mintTokensFromEXP } from '@/lib/backend-wallet';

// Faucet configuration (off-chain tracking)
const FAUCET_AMOUNT = 1000; // 1000 KASTURI tokens
const FAUCET_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// POST /api/tokens/faucet - Claim free tokens from faucet (GASLESS)
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

    const normalizedAddress = walletAddress.toLowerCase();

    // Get user
    const user = await prisma.user.findUnique({
      where: { walletAddress: normalizedAddress },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check last faucet claim from database
    const lastClaim = await prisma.faucetClaim.findFirst({
      where: { walletAddress: normalizedAddress },
      orderBy: { claimedAt: 'desc' },
    });

    if (lastClaim) {
      const timeSinceLastClaim = Date.now() - lastClaim.claimedAt.getTime();
      if (timeSinceLastClaim < FAUCET_COOLDOWN_MS) {
        const timeUntilNext = Math.ceil((FAUCET_COOLDOWN_MS - timeSinceLastClaim) / 1000);
        const hours = timeUntilNext / 3600;
        return NextResponse.json(
          { 
            error: `Faucet cooldown active. Try again in ${hours.toFixed(1)} hours.`,
            timeUntilNext,
          },
          { status: 400 }
        );
      }
    }

    // Mint tokens using backend wallet (GASLESS for user)
    console.log('🔗 Minting faucet tokens via backend...');
    const result = await mintTokensFromEXP(
      normalizedAddress as `0x${string}`,
      FAUCET_AMOUNT
    );
    console.log('✅ Faucet tokens minted! TxHash:', result.hash);

    // Record the faucet claim in database
    await prisma.faucetClaim.create({
      data: {
        userId: user.id,
        walletAddress: normalizedAddress,
        amount: FAUCET_AMOUNT,
        txHash: result.hash,
      },
    });

    return NextResponse.json({
      success: true,
      txHash: result.hash,
      amount: FAUCET_AMOUNT,
      explorerUrl: `https://sepolia-blockscout.lisk.com/tx/${result.hash}`,
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

    const normalizedAddress = walletAddress.toLowerCase();

    // Check last faucet claim from database
    const lastClaim = await prisma.faucetClaim.findFirst({
      where: { walletAddress: normalizedAddress },
      orderBy: { claimedAt: 'desc' },
    });

    let canClaim = true;
    let timeUntilNext = 0;

    if (lastClaim) {
      const timeSinceLastClaim = Date.now() - lastClaim.claimedAt.getTime();
      if (timeSinceLastClaim < FAUCET_COOLDOWN_MS) {
        canClaim = false;
        timeUntilNext = Math.ceil((FAUCET_COOLDOWN_MS - timeSinceLastClaim) / 1000);
      }
    }

    return NextResponse.json({
      canClaim,
      timeUntilNext,
      faucetAmount: FAUCET_AMOUNT,
    });
  } catch (error) {
    console.error('Error checking faucet status:', error);
    return NextResponse.json(
      { error: 'Failed to check faucet status' },
      { status: 500 }
    );
  }
}
