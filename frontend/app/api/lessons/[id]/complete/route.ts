import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mintTokensFromEXP } from '@/lib/backend-wallet';

// POST /api/lessons/[id]/complete - Mark lesson as complete and mint tokens
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { walletAddress, score } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      );
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { walletAddress: walletAddress.toLowerCase() },
      });
    }

    // Get lesson
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: { program: true },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Check if already completed
    const existingProgress = await prisma.userProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: id,
        },
      },
    });

    if (existingProgress) {
      return NextResponse.json(
        { error: 'Lesson already completed', progress: existingProgress },
        { status: 400 }
      );
    }

    // Calculate EXP based on score (minimum 70% to pass)
    const passThreshold = 70;
    const passed = (score || 100) >= passThreshold;

    if (!passed) {
      return NextResponse.json(
        { error: 'Score too low to complete lesson', score, required: passThreshold },
        { status: 400 }
      );
    }

    const expEarned = lesson.expReward;

    // Create progress record
    const progress = await prisma.userProgress.create({
      data: {
        userId: user.id,
        lessonId: id,
        expEarned,
      },
    });

    // Mint tokens on-chain
    let txHash: string | null = null;
    try {
      const result = await mintTokensFromEXP(walletAddress, expEarned);
      txHash = result.hash;
      
      // Update progress with claim status
      await prisma.userProgress.update({
        where: { id: progress.id },
        data: {
          claimedOnChain: true,
          claimTxHash: txHash,
          claimedAt: new Date(),
        },
      });
    } catch (mintError) {
      console.error('Failed to mint tokens:', mintError);
      // Continue even if minting fails - can retry later
    }

    // Check if program is complete
    const programLessons = await prisma.lesson.count({
      where: { programId: lesson.program.id, isActive: true },
    });

    const completedLessons = await prisma.userProgress.count({
      where: {
        userId: user.id,
        lesson: { programId: lesson.program.id },
      },
    });

    const programComplete = completedLessons >= programLessons;

    return NextResponse.json({
      success: true,
      progress: {
        lessonId: id,
        expEarned,
        txHash,
        programComplete,
        completedLessons,
        totalLessons: programLessons,
      },
    });
  } catch (error) {
    console.error('Error completing lesson:', error);
    return NextResponse.json(
      { error: 'Failed to complete lesson' },
      { status: 500 }
    );
  }
}
