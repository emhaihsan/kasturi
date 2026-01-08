import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/credentials - Get user's credentials
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

    // Get user with credentials
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
      include: {
        credentials: true,
      },
    });

    if (!user) {
      return NextResponse.json({ credentials: [] });
    }

    // Get program details for each credential
    const credentialsWithPrograms = await Promise.all(
      user.credentials.map(async (cred) => {
        const program = await prisma.program.findFirst({
          where: { programId: cred.programId },
          select: {
            id: true,
            name: true,
            language: true,
          },
        });

        return {
          id: cred.id,
          programId: cred.programId,
          programName: program?.name || 'Unknown Program',
          language: program?.language || 'Unknown',
          txHash: cred.txHash,
          issuedAt: cred.issuedAt.toISOString(),
          explorerUrl: `https://sepolia-blockscout.lisk.com/tx/${cred.txHash}`,
        };
      })
    );

    // Calculate total EXP
    const userProgress = await prisma.userProgress.findMany({
      where: { userId: user.id },
      select: { expEarned: true },
    });
    const totalExp = userProgress.reduce((sum, p) => sum + p.expEarned, 0);

    return NextResponse.json({
      credentials: credentialsWithPrograms,
      user: {
        displayName: user.displayName,
        walletAddress: user.walletAddress,
      },
      totalExp,
    });
  } catch (error) {
    console.error('Error fetching credentials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credentials' },
      { status: 500 }
    );
  }
}
