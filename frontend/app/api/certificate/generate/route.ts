import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/certificate/generate - Generate certificate data for display
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const credentialId = searchParams.get('credentialId');
    const txHash = searchParams.get('txHash');

    if (!credentialId && !txHash) {
      return NextResponse.json(
        { error: 'Credential ID or transaction hash required' },
        { status: 400 }
      );
    }

    // Find credential
    let credential;
    if (credentialId) {
      credential = await prisma.issuedCredential.findUnique({
        where: { id: credentialId },
        include: {
          user: {
            select: {
              walletAddress: true,
              displayName: true,
              email: true,
            },
          },
        },
      });
    } else if (txHash) {
      credential = await prisma.issuedCredential.findFirst({
        where: { txHash },
        include: {
          user: {
            select: {
              walletAddress: true,
              displayName: true,
              email: true,
            },
          },
        },
      });
    }

    if (!credential) {
      return NextResponse.json(
        { error: 'Credential not found' },
        { status: 404 }
      );
    }

    // Get program details
    const program = await prisma.program.findUnique({
      where: { programId: credential.programId },
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Generate certificate data
    const certificateData = {
      id: credential.id,
      programName: program.name,
      programId: program.programId,
      language: program.language,
      recipientName: credential.user.displayName || 'Anonymous Learner',
      recipientAddress: credential.user.walletAddress,
      issuedAt: credential.issuedAt.toISOString(),
      txHash: credential.txHash,
      verificationUrl: `https://sepolia-blockscout.lisk.com/tx/${credential.txHash}`,
      contractAddress: process.env.NEXT_PUBLIC_KASTURI_SBT || '0x994275a953074accf218c9b5b77ea55cef00d17b',
    };

    return NextResponse.json({
      success: true,
      certificate: certificateData,
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}
