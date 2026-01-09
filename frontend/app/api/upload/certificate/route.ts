import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

const PINATA_JWT = process.env.PINATA_JWT;
const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud';

export async function POST(req: NextRequest) {
  try {
    const { svg, filename } = await req.json();

    if (!svg || !filename) {
      return NextResponse.json(
        { error: 'SVG content and filename are required' },
        { status: 400 }
      );
    }

    if (!PINATA_JWT) {
      return NextResponse.json(
        { error: 'Pinata JWT not configured' },
        { status: 500 }
      );
    }

    // Convert SVG to PNG using sharp
    const pngBuffer = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();

    // Upload to Pinata
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(pngBuffer)], { type: 'image/png' });
    formData.append('file', blob, filename);

    const pinataMetadata = JSON.stringify({
      name: filename,
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', pinataOptions);

    const uploadRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: formData,
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error('Pinata upload error:', errorText);
      throw new Error(`Pinata upload failed: ${uploadRes.status}`);
    }

    const uploadData = await uploadRes.json();
    const ipfsUrl = `ipfs://${uploadData.IpfsHash}`;

    return NextResponse.json({
      ipfsUrl,
      httpUrl: `https://${PINATA_GATEWAY}/ipfs/${uploadData.IpfsHash}`,
    });
  } catch (error) {
    console.error('Certificate upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload certificate' },
      { status: 500 }
    );
  }
}
