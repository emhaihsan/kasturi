import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/credentials/[id] - Get credential by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find credential by ID
    const credential = await prisma.issuedCredential.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            displayName: true,
            walletAddress: true,
          },
        },
      },
    });

    if (!credential) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // Get program details
    const program = await prisma.program.findFirst({
      where: { programId: credential.programId },
      select: {
        id: true,
        name: true,
        language: true,
      },
    });

    return NextResponse.json({
      credential: {
        id: credential.id,
        programId: credential.programId,
        programName: program?.name || 'Unknown Program',
        language: program?.language || 'Unknown',
        txHash: credential.txHash,
        metadataUrl: credential.metadataUrl,
        issuedAt: credential.issuedAt.toISOString(),
        recipientName: credential.user.displayName || 'Anonymous Learner',
        recipientAddress: credential.user.walletAddress,
        explorerUrl: `https://sepolia-blockscout.lisk.com/tx/${credential.txHash}`,
      },
    });
  } catch (error) {
    console.error('Error fetching credential:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credential' },
      { status: 500 }
    );
  }
}
