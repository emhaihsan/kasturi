import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { issueCredential, setCredentialTokenURI } from '@/lib/backend-wallet';

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
    const formattedProgramId = program.programId as `0x${string}`;
    
    const result = await issueCredential(formattedWallet, formattedProgramId);
    console.log('✅ Credential issued! TxHash:', result.hash);

    // Save to database first
    const credential = await prisma.issuedCredential.create({
      data: {
        userId: user.id,
        programId: program.programId,
        txHash: result.hash,
      },
    });

    // Generate and upload certificate image + metadata to IPFS
    console.log('📸 Generating certificate image...');
    try {
      const { uploadCertificateImage } = await import('@/lib/certificate-generator');
      const { uploadSBTMetadata } = await import('@/lib/pinata');
      
      const certificateImageUrl = await uploadCertificateImage({
        programName: program.name,
        recipientName: user.displayName || 'Anonymous Learner',
        recipientAddress: walletAddress,
        issuedAt: new Date().toISOString(),
        txHash: result.hash,
        language: program.language,
      });
      
      console.log('🖼️ Certificate image uploaded:', certificateImageUrl);
      
      // Upload metadata with certificate image
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
        programId: program.programId,
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
