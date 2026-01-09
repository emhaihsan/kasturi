import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { issueCredential, setCredentialTokenURI } from '@/lib/backend-wallet';
import { uploadSBTMetadata } from '@/lib/pinata';
import { generateCertificateSVG } from '@/lib/certificate-generator';
import { keccak256, toHex } from 'viem';
import PinataClient from '@pinata/sdk';

const pinata = new PinataClient({
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretApiKey: process.env.PINATA_SECRET_KEY!,
});

// POST /api/test-mint - Test mint SBT with full metadata (for testing purposes)
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

    // Generate a unique programId based on program name
    const programId = keccak256(toHex(`test-${programName}-${Date.now()}`));
    const formattedWallet = walletAddress.toLowerCase() as `0x${string}`;

    // Issue credential on-chain first
    console.log('🔗 Issuing credential on-chain...');
    const result = await issueCredential(formattedWallet, programId);
    console.log('✅ Credential issued! TxHash:', result.hash);

    // Generate certificate SVG
    console.log('📸 Generating certificate image...');
    const certificateData = {
      programName,
      recipientName,
      recipientAddress: walletAddress,
      issuedAt: new Date().toISOString(),
      txHash: result.hash,
      language,
    };
    
    const svgDataUrl = generateCertificateSVG(certificateData);
    
    // Upload SVG to Pinata
    console.log('🖼️ Uploading certificate to IPFS...');
    const { Readable } = await import('stream');
    const base64Data = svgDataUrl.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    const stream = Readable.from(buffer);
    
    const imageResult = await pinata.pinFileToIPFS(stream, {
      pinataMetadata: {
        name: `kasturi-cert-${result.hash.slice(0, 10)}.svg`,
      },
    });
    
    const certificateImageUrl = `ipfs://${imageResult.IpfsHash}`;
    console.log('🖼️ Certificate image uploaded:', certificateImageUrl);
    
    // Upload metadata with certificate image
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

    // Set tokenURI on-chain so wallets can display metadata
    if (result.tokenId !== null) {
      console.log('🔗 Setting tokenURI on-chain for tokenId:', result.tokenId.toString());
      await setCredentialTokenURI(result.tokenId, metadataUrl);
      console.log('✅ tokenURI set on-chain');
    } else {
      console.warn('⚠️ tokenId not found from receipt logs; cannot set tokenURI on-chain');
    }

    // Get or create user for database record
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

    // Save credential to database
    const credential = await prisma.issuedCredential.create({
      data: {
        userId: user.id,
        programId,
        txHash: result.hash,
        metadataUrl,
      },
    });

    // Get IPFS gateway URLs for preview
    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs';
    const imageHttpUrl = `${gateway}/${imageResult.IpfsHash}`;
    const metadataHash = metadataUrl.replace('ipfs://', '');
    const metadataHttpUrl = `${gateway}/${metadataHash}`;

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
