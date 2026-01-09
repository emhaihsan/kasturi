import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

async function getFont(fontFamily: string, weight: number = 400) {
  const url = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@${weight}&display=swap`;
  const css = await (await fetch(url)).text();
  const fontUrl = css.match(/src: url\((.+?)\)/)?.[1];
  if (!fontUrl) throw new Error('Could not find font URL');
  return fetch(fontUrl).then((res) => res.arrayBuffer());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      programName, 
      recipientName, 
      recipientAddress, 
      issuedAt, 
      txHash,
      certificateId,
      language 
    } = body;

    if (!programName || !recipientName || !recipientAddress || !txHash) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const dateObj = new Date(issuedAt || new Date());
    const displayDate = dateObj.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const certId = txHash;
    const displayTxHash = `${txHash.slice(0, 10)}...${txHash.slice(-8)}`;

    const [interRegular, interBold, interExtraBold] = await Promise.all([
      getFont('Inter', 400),
      getFont('Inter', 700),
      getFont('Inter', 800),
    ]);

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(145deg, #065f46 0%, #0d9488 50%, #065f46 100%)',
            fontFamily: '"Inter"',
            position: 'relative',
          }}
        >
          {/* Decorative pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)',
              display: 'flex',
            }}
          />
          
          {/* Double border */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              right: '12px',
              bottom: '12px',
              border: '2px solid rgba(255,255,255,0.25)',
              borderRadius: '16px',
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              bottom: '20px',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              display: 'flex',
            }}
          />

          {/* Content container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '40px 50px',
              flex: 1,
            }}
          >
            {/* Header with logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px',
              }}
            >
              {/* Kasturi Logo from public folder */}
              <img
                src={`${new URL(req.url).origin}/icon.png`}
                width="48"
                height="48"
                style={{
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '24px', fontWeight: 800, color: 'white', letterSpacing: '1px' }}>
                  KASTURI
                </span>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', letterSpacing: '2px' }}>
                  LEARN • EARN • PRESERVE
                </span>
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '24px',
                marginBottom: '20px',
              }}
            >
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', letterSpacing: '3px', marginBottom: '8px' }}>
                CERTIFICATE OF COMPLETION
              </span>
              <div
                style={{
                  width: '60px',
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)',
                  borderRadius: '2px',
                }}
              />
            </div>

            {/* Main content */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                This is to certify that
              </span>
              
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 700,
                  color: '#fde047',
                  marginBottom: '8px',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                {recipientName}
              </span>

              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
                has successfully completed
              </span>

              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: '24px',
                }}
              >
                {programName}
              </span>

              {/* Wallet address box */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'rgba(0,0,0,0.2)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                  WALLET ADDRESS
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#a7f3d0',
                    letterSpacing: '0.5px',
                  }}
                >
                  {recipientAddress}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginTop: '20px',
              }}
            >
              {/* Left: Date */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>
                  ISSUED ON
                </span>
                <span style={{ fontSize: '14px', color: 'white', fontWeight: 600 }}>
                  {displayDate}
                </span>
              </div>

              {/* Center: TX Hash */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>
                  TX HASH
                </span>
                <span style={{ fontSize: '9px', color: '#fbbf24', fontWeight: 600, fontFamily: 'monospace' }}>
                  {certId}
                </span>
              </div>

              {/* Right: Blockchain */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>
                  VERIFIED ON LISK SEPOLIA
                </span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
                  {displayTxHash}
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 800,
        height: 500,
        fonts: [
          { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
          { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
          { name: 'Inter', data: interExtraBold, weight: 800, style: 'normal' },
        ],
      }
    );

    // Convert the image to a buffer
    const imageBuffer = await imageResponse.arrayBuffer();

    // Upload image to Pinata with explicit PNG content-type
    const formData = new FormData();
    const pngBlob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('file', pngBlob, 'certificate.png');

    const PINATA_JWT = process.env.PINATA_JWT;
    if (!PINATA_JWT) {
      return NextResponse.json(
        { error: 'Pinata JWT not configured' },
        { status: 500 }
      );
    }

    const imageUploadRes = await fetch(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: formData,
      }
    );

    if (!imageUploadRes.ok) {
      console.error('Pinata image upload error:', await imageUploadRes.text());
      return NextResponse.json(
        { error: 'Failed to upload certificate image to IPFS' },
        { status: 500 }
      );
    }

    const imageUploadData = await imageUploadRes.json();
    const imageIpfsHash = imageUploadData.IpfsHash;
    const imageIpfsUrl = `ipfs://${imageIpfsHash}`;
    const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud';
    const httpUrl = `https://${PINATA_GATEWAY}/ipfs/${imageIpfsHash}`;

    return NextResponse.json({
      ipfsUrl: imageIpfsUrl,
      httpUrl,
      ipfsHash: imageIpfsHash,
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}
