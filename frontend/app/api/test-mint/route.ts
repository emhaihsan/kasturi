import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { issueCredential, setCredentialTokenURI } from '@/lib/backend-wallet';
import { uploadSBTMetadata } from '@/lib/pinata';
import { keccak256, toHex } from 'viem';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      walletAddress, 
      programName, 
      recipientName, 
      language = 'Bahasa Banjar'
    } = body;

    console.log('🧪 Test mint request:', { walletAddress, programName, recipientName, language });

    if (!walletAddress || !programName || !recipientName) {
      return NextResponse.json(
        { error: 'Missing required fields: walletAddress, programName, recipientName' },
        { status: 400 }
      );
    }

    const programId = keccak256(toHex(`test-${programName}-${Date.now()}`));
    const formattedWallet = walletAddress.toLowerCase() as `0x${string}`;

    console.log('🔗 Issuing credential on-chain...');
    const result = await issueCredential(formattedWallet, programId);
    console.log('✅ Credential issued! TxHash:', result.hash);

    console.log('📸 Generating certificate PNG...');
    const origin = new URL(request.url).origin;
    const certResponse = await fetch(`${origin}/api/certificate/image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        programName,
        recipientName,
        recipientAddress: walletAddress,
        issuedAt: new Date().toISOString(),
        txHash: result.hash,
        language,
      }),
    });

    if (!certResponse.ok) {
      const errorData = await certResponse.json();
      throw new Error(`Certificate generation failed: ${errorData.error}`);
    }

    const certData = await certResponse.json();
    const certificateImageUrl = certData.ipfsUrl;
    const imageIpfsHash = certData.ipfsHash;
    console.log('🖼️ Certificate PNG uploaded:', certificateImageUrl);
    
    console.log('📦 Uploading metadata to IPFS...');
    const metadataUrl = await uploadSBTMetadata(
      programName,
      programId,
      walletAddress,
      recipientName,
      result.hash,
      new Date(),
      certificateImageUrl,
      language
    );
    console.log('📦 Metadata uploaded:', metadataUrl);

    if (result.tokenId !== null) {
      console.log('🔗 Setting tokenURI on-chain for tokenId:', result.tokenId.toString());
      await setCredentialTokenURI(result.tokenId, metadataUrl);
      console.log('✅ tokenURI set on-chain');
    } else {
      console.warn('⚠️ tokenId not found from receipt logs; cannot set tokenURI on-chain');
    }

    let user = await prisma.user.findUnique({
      where: { walletAddress: formattedWallet },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: formattedWallet,
          displayName: recipientName,
        },
      });
    }

    const credential = await prisma.issuedCredential.create({
      data: {
        userId: user.id,
        programId,
        txHash: result.hash,
        metadataUrl,
      },
    });

    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud';
    const imageHttpUrl = `https://${gateway}/ipfs/${imageIpfsHash}`;
    const metadataHash = metadataUrl.replace('ipfs://', '');
    const metadataHttpUrl = `https://${gateway}/ipfs/${metadataHash}`;

    return NextResponse.json({
      success: true,
      credential: {
        id: credential.id,
        programId,
        programName,
        recipientName,
        txHash: result.hash,
        metadataUrl,
        imageUrl: certificateImageUrl,
      },
      urls: {
        blockscout: `https://sepolia-blockscout.lisk.com/tx/${result.hash}`,
        imagePreview: imageHttpUrl,
        metadataPreview: metadataHttpUrl,
      },
    });
  } catch (error) {
    console.error('❌ Error test minting:', error);
    return NextResponse.json(
      { error: 'Failed to mint: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
