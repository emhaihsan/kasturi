import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { issueCredential, setCredentialTokenURI } from '@/lib/backend-wallet';
import { keccak256, toHex } from 'viem';

function isBytes32Hex(value: unknown): value is `0x${string}` {
  if (typeof value !== 'string') return false;
  return /^0x[0-9a-fA-F]{64}$/.test(value);
}

// POST /api/credentials/claim - Claim credential after completing a program
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, programId } = body;

    console.log('📜 Credential claim request:', { walletAddress, programId });

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
      console.log('❌ User not found:', walletAddress);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get program by programId (bytes32 hash)
    let program = await prisma.program.findUnique({
      where: { programId },
      include: {
        modules: {
          where: { isActive: true },
          include: {
            lessons: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    // If not found, maybe programId is the database id - try that
    if (!program) {
      program = await prisma.program.findUnique({
        where: { id: programId },
        include: {
          modules: {
            where: { isActive: true },
            include: {
              lessons: {
                where: { isActive: true },
              },
            },
          },
        },
      });
    }

    if (!program) {
      console.log('❌ Program not found:', programId);
      return NextResponse.json(
        { error: 'Program not found', programId },
        { status: 404 }
      );
    }

    // Ensure program.programId is a valid bytes32 hex for on-chain calls.
    // Some seed data used a human-readable slug (e.g. "bahasa-banjar").
    // We deterministically convert it to bytes32 using keccak256(toHex(slug)).
    let onChainProgramId: `0x${string}`;
    if (isBytes32Hex(program.programId)) {
      onChainProgramId = program.programId;
    } else {
      const legacy = program.programId;
      onChainProgramId = keccak256(toHex(legacy)) as `0x${string}`;

      // Best-effort: persist the upgraded bytes32 programId for future requests.
      // If another record already uses the same programId, skip updating.
      try {
        const existing = await prisma.program.findUnique({ where: { programId: onChainProgramId } });
        if (!existing) {
          await prisma.program.update({
            where: { id: program.id },
            data: { programId: onChainProgramId },
          });
          program = { ...program, programId: onChainProgramId } as typeof program;
          console.log('✅ Upgraded legacy programId to bytes32:', { legacy, onChainProgramId });
        } else {
          console.warn('⚠️ Cannot upgrade legacy programId due to unique collision:', {
            legacy,
            onChainProgramId,
            existingProgramDbId: existing.id,
          });
        }
      } catch (e) {
        console.warn('⚠️ Failed to persist upgraded programId, continuing anyway:', e);
      }
    }

    const totalLessons = program.modules.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0);
    console.log('✅ Found program:', program.name, 'with', totalLessons, 'lessons');

    // Check if user has completed all lessons
    const completedLessons = await prisma.userProgress.count({
      where: {
        userId: user.id,
        lesson: {
          isActive: true,
          module: {
            programId: program.id,
          },
        },
      },
    });

    console.log('📊 User progress:', completedLessons, '/', totalLessons);

    if (completedLessons < totalLessons) {
      return NextResponse.json(
        { 
          error: `Program not completed. Completed ${completedLessons} of ${totalLessons} lessons.`,
          completed: completedLessons,
          required: totalLessons,
        },
        { status: 400 }
      );
    }

    // Check if credential already issued
    const existingCredential = await prisma.issuedCredential.findFirst({
      where: { userId: user.id, programId: program.programId },
    });

    if (existingCredential) {
      console.log('⚠️ Credential already issued:', existingCredential.txHash);
      return NextResponse.json({
        success: true,
        credential: {
          id: existingCredential.id,
          programId: program.programId,
          programName: program.name,
          txHash: existingCredential.txHash,
          alreadyIssued: true,
        },
      });
    }

    // Issue credential on-chain
    console.log('🔗 Issuing credential on-chain...');
    const formattedWallet = walletAddress.toLowerCase() as `0x${string}`;
    const result = await issueCredential(formattedWallet, onChainProgramId);
    console.log('✅ Credential issued! TxHash:', result.hash);

    // Save to database first
    const credential = await prisma.issuedCredential.create({
      data: {
        userId: user.id,
        programId: program.programId,
        txHash: result.hash,
      },
    });

    // Generate and upload certificate image + metadata to IPFS (same flow as test-mint)
    console.log('📸 Generating certificate PNG...');
    try {
      const { uploadSBTMetadata } = await import('@/lib/pinata');
      
      // Use the same certificate image endpoint as test-mint
      const origin = request.url ? new URL(request.url).origin : 'http://localhost:3000';
      const certResponse = await fetch(`${origin}/api/certificate/image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programName: program.name,
          recipientName: user.displayName || 'Anonymous Learner',
          recipientAddress: walletAddress,
          issuedAt: new Date().toISOString(),
          txHash: result.hash,
          language: program.language,
        }),
      });

      if (!certResponse.ok) {
        const errorData = await certResponse.json();
        throw new Error(`Certificate generation failed: ${errorData.error}`);
      }

      const certData = await certResponse.json();
      const certificateImageUrl = certData.ipfsUrl;
      console.log('🖼️ Certificate PNG uploaded:', certificateImageUrl);
      
      // Upload metadata with certificate image
      console.log('📦 Uploading metadata to IPFS...');
      const metadataUrl = await uploadSBTMetadata(
        program.name,
        program.programId,
        walletAddress,
        user.displayName || 'Anonymous Learner',
        result.hash,
        new Date(),
        certificateImageUrl,
        program.language
      );
      
      console.log('📦 Metadata uploaded:', metadataUrl);

      // Store tokenURI on-chain so wallets can display metadata
      if (result.tokenId !== null) {
        console.log('🔗 Setting tokenURI on-chain for tokenId:', result.tokenId.toString());
        await setCredentialTokenURI(result.tokenId, metadataUrl);
        console.log('✅ tokenURI set on-chain');
      } else {
        console.warn('⚠️ tokenId not found from receipt logs; cannot set tokenURI on-chain');
      }
      
      // Update credential with metadata URL
      await prisma.issuedCredential.update({
        where: { id: credential.id },
        data: { metadataUrl },
      });
    } catch (metadataError) {
      console.error('⚠️ Failed to upload metadata, but credential was issued:', metadataError);
      // Continue anyway - credential is already on-chain
    }

    return NextResponse.json({
      success: true,
      credential: {
        id: credential.id,
        programId: onChainProgramId,
        programName: program.name,
        txHash: result.hash,
      },
    });
  } catch (error) {
    console.error('❌ Error claiming credential:', error);
    return NextResponse.json(
      { error: 'Failed to claim credential: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
