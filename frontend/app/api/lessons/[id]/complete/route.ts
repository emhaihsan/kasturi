import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST /api/lessons/[id]/complete - Mark lesson as completed
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

    // Get lesson
    const lesson = await prisma.lesson.findUnique({
      where: { id },
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
          lessonId: lesson.id,
        },
      },
    });

    if (existingProgress) {
      // Update score if better
      if (score && score > (existingProgress.score || 0)) {
        await prisma.userProgress.update({
          where: { id: existingProgress.id },
          data: { score },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Lesson already completed',
        progress: existingProgress,
      });
    }

    // Create progress record
    const progress = await prisma.userProgress.create({
      data: {
        userId: user.id,
        lessonId: lesson.id,
        score: score || 100,
        expEarned: lesson.expReward,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Lesson completed',
      progress,
      expEarned: lesson.expReward,
    });
  } catch (error) {
    console.error('Error completing lesson:', error);
    return NextResponse.json(
      { error: 'Failed to complete lesson' },
      { status: 500 }
    );
  }
}
