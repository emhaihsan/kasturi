import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { issueCredential } from '@/lib/backend-wallet';
import { uploadSBTMetadata } from '@/lib/pinata';

// POST /api/credentials/claim - Claim credential after completing a program
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, programId } = body;

    if (!walletAddress || !programId) {
      return NextResponse.json(
        { error: 'Wallet address and program ID required' },
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

    // Get program
    const program = await prisma.program.findUnique({
      where: { programId },
      include: {
        lessons: {
          where: { isActive: true },
        },
      },
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Check if user has completed all lessons
    const completedLessons = await prisma.userProgress.count({
      where: {
        userId: user.id,
        lesson: { programId: program.id },
      },
    });

    if (completedLessons < program.lessons.length) {
      return NextResponse.json(
        { 
          error: 'Program not completed',
          completed: completedLessons,
          required: program.lessons.length,
        },
        { status: 400 }
      );
    }

    // Upload metadata to IPFS
    let metadataUri: string | undefined;
    try {
      metadataUri = await uploadSBTMetadata(
        program.name,
        program.programId,
        walletAddress,
        new Date()
      );
    } catch (error) {
      console.error('Failed to upload metadata:', error);
      // Continue without metadata
    }

    // Check if credential already issued
    const existingCredential = await prisma.issuedCredential.findFirst({
      where: { userId: user.id, programId: program.programId },
    });

    if (existingCredential) {
      return NextResponse.json(
        { error: 'Credential already issued', credential: existingCredential },
        { status: 400 }
      );
    }

    // Issue credential on-chain
    const result = await issueCredential(walletAddress, programId);

    // Save to database
    const credential = await prisma.issuedCredential.create({
      data: {
        userId: user.id,
        programId: program.programId,
        txHash: result.hash,
      },
    });

    return NextResponse.json({
      success: true,
      credential: {
        id: credential.id,
        programId,
        programName: program.name,
        txHash: result.hash,
        metadataUri,
      },
    });
  } catch (error) {
    console.error('Error claiming credential:', error);
    return NextResponse.json(
      { error: 'Failed to claim credential' },
      { status: 500 }
    );
  }
}
