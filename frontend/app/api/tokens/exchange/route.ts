import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mintTokensFromEXP } from '@/lib/backend-wallet';

// POST /api/tokens/exchange - Exchange EXP for Kasturi Tokens
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, expAmount } = body;

    console.log('💱 Token exchange request:', { walletAddress, expAmount });

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      );
    }

    if (!expAmount || expAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid EXP amount' },
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

    // Calculate available EXP from completed lessons
    const userProgress = await prisma.userProgress.findMany({
      where: { userId: user.id },
      select: { expEarned: true, claimedOnChain: true },
    });

    const totalEarned = userProgress.reduce((sum, p) => sum + p.expEarned, 0);
    const alreadyClaimed = userProgress.filter(p => p.claimedOnChain).reduce((sum, p) => sum + p.expEarned, 0);
    const availableExp = totalEarned - alreadyClaimed;

    console.log('📊 EXP status:', { totalEarned, alreadyClaimed, availableExp, requested: expAmount });

    if (expAmount > availableExp) {
      return NextResponse.json(
        { 
          error: `Insufficient EXP. Available: ${availableExp}, Requested: ${expAmount}`,
          availableExp,
        },
        { status: 400 }
      );
    }

    // Mint tokens on-chain (1 EXP = 1 KASTURI token)
    console.log('🔗 Minting tokens on-chain...');
    const result = await mintTokensFromEXP(
      walletAddress.toLowerCase() as `0x${string}`,
      expAmount
    );
    console.log('✅ Tokens minted! TxHash:', result.hash);

    // Mark the EXP as claimed (update progress records)
    let expToMark = expAmount;
    for (const progress of userProgress) {
      if (expToMark <= 0) break;
      if (progress.claimedOnChain) continue;
      
      // This is a simplified approach - in production you'd track more precisely
      expToMark -= progress.expEarned;
    }

    // Update unclaimed progress records
    await prisma.userProgress.updateMany({
      where: {
        userId: user.id,
        claimedOnChain: false,
      },
      data: {
        claimedOnChain: true,
        claimTxHash: result.hash,
        claimedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      txHash: result.hash,
      expExchanged: expAmount,
      tokensReceived: expAmount, // 1:1 ratio
      explorerUrl: `https://sepolia-blockscout.lisk.com/tx/${result.hash}`,
    });
  } catch (error) {
    console.error('❌ Error exchanging tokens:', error);
    return NextResponse.json(
      { error: 'Failed to exchange tokens: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

// GET /api/tokens/exchange - Get user's EXP status
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

    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({
        totalExp: 0,
        claimedExp: 0,
        availableExp: 0,
      });
    }

    const userProgress = await prisma.userProgress.findMany({
      where: { userId: user.id },
      select: { expEarned: true, claimedOnChain: true },
    });

    const totalExp = userProgress.reduce((sum, p) => sum + p.expEarned, 0);
    const claimedExp = userProgress.filter(p => p.claimedOnChain).reduce((sum, p) => sum + p.expEarned, 0);
    const availableExp = totalExp - claimedExp;

    return NextResponse.json({
      totalExp,
      claimedExp,
      availableExp,
    });
  } catch (error) {
    console.error('Error getting EXP status:', error);
    return NextResponse.json(
      { error: 'Failed to get EXP status' },
      { status: 500 }
    );
  }
}
