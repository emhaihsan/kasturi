import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/credentials/check - Check if user has a credential
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const programId = searchParams.get('programId');

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
      return NextResponse.json({ hasCredential: false });
    }

    // Check credential
    const credential = await prisma.issuedCredential.findFirst({
      where: {
        userId: user.id,
        programId,
      },
    });

    return NextResponse.json({
      hasCredential: !!credential,
      credential: credential ? {
        id: credential.id,
        txHash: credential.txHash,
        issuedAt: credential.issuedAt.toISOString(),
      } : null,
    });
  } catch (error) {
    console.error('Error checking credential:', error);
    return NextResponse.json(
      { error: 'Failed to check credential' },
      { status: 500 }
    );
  }
}
