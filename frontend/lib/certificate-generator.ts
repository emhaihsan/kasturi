// Certificate Image Generator for SBT Metadata
// Generates certificate images and uploads to Pinata

interface CertificateData {
  programName: string;
  recipientName: string;
  recipientAddress: string;
  issuedAt: string;
  txHash: string;
  language?: string;
}

/**
 * Generate certificate SVG
 * This creates an SVG image that will be converted to PNG
 */
export function generateCertificateSVG(data: CertificateData): string {
  const formattedDate = new Date(data.issuedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Use full address instead of shortened
  const fullAddress = data.recipientAddress;
  const blockscoutUrl = `https://sepolia-blockscout.lisk.com/tx/${data.txHash}`;

  const svg = `
    <svg width="800" height="566" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#059669;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#0d9488;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
        </linearGradient>
        
        <!-- Pattern circles -->
        <pattern id="circles" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="50" cy="50" r="40" fill="none" stroke="white" stroke-opacity="0.05" stroke-width="1"/>
        </pattern>
      </defs>
      
      <!-- Background -->
      <rect width="800" height="566" fill="url(#bg)"/>
      <rect width="800" height="566" fill="url(#circles)"/>
      
      <!-- Borders -->
      <rect x="16" y="16" width="768" height="534" fill="none" stroke="white" stroke-opacity="0.3" stroke-width="2" rx="8"/>
      <rect x="24" y="24" width="752" height="518" fill="none" stroke="white" stroke-opacity="0.2" stroke-width="1" rx="8"/>
      
      <!-- Logo (simplified leaf icon) -->
      <circle cx="400" cy="70" r="25" fill="#fbbf24" opacity="0.9"/>
      <path d="M 400 55 Q 410 65 400 75 Q 390 65 400 55" fill="white"/>
      <circle cx="400" cy="70" r="12" fill="none" stroke="white" stroke-width="2"/>
      
      <!-- Brand Name -->
      <text x="400" y="115" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">KASTURI</text>
      <text x="400" y="135" font-family="Arial, sans-serif" font-size="10" fill="#d1fae5" text-anchor="middle" letter-spacing="2">LEARN • EARN • PRESERVE</text>
      
      <!-- Certificate Title -->
      <text x="400" y="175" font-family="Arial, sans-serif" font-size="14" fill="#d1fae5" text-anchor="middle">CERTIFICATE OF COMPLETION</text>
      <text x="400" y="210" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="white" text-anchor="middle">${data.programName}</text>
      
      <!-- Recipient Info -->
      <text x="400" y="255" font-family="Arial, sans-serif" font-size="12" fill="#d1fae5" text-anchor="middle">This is to certify that</text>
      <text x="400" y="285" font-family="Arial, sans-serif" font-size="20" font-weight="600" fill="white" text-anchor="middle">${data.recipientName}</text>
      <text x="400" y="310" font-family="monospace" font-size="10" fill="#a7f3d0" text-anchor="middle">${fullAddress}</text>
      <text x="400" y="340" font-family="Arial, sans-serif" font-size="11" fill="#d1fae5" text-anchor="middle">has successfully completed the ${data.language || 'language'} learning program</text>
      
      <!-- Footer -->
      <text x="120" y="420" font-family="Arial, sans-serif" font-size="10" fill="#a7f3d0">Issue Date</text>
      <text x="120" y="440" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="white">${formattedDate}</text>
      
      <!-- QR Code placeholder (white square) -->
      <rect x="640" y="400" width="80" height="80" fill="white" rx="4"/>
      <text x="680" y="495" font-family="Arial, sans-serif" font-size="8" fill="#059669" text-anchor="middle">Verify On-Chain</text>
      
      <!-- QR Code pattern (simplified) -->
      <rect x="645" y="405" width="70" height="70" fill="none" stroke="#059669" stroke-width="1"/>
      <rect x="650" y="410" width="10" height="10" fill="#059669"/>
      <rect x="670" y="410" width="10" height="10" fill="#059669"/>
      <rect x="650" y="430" width="10" height="10" fill="#059669"/>
      <rect x="670" y="430" width="10" height="10" fill="#059669"/>
      <rect x="650" y="450" width="10" height="10" fill="#059669"/>
      <rect x="670" y="450" width="10" height="10" fill="#059669"/>
      <rect x="690" y="410" width="10" height="10" fill="#059669"/>
      <rect x="710" y="410" width="10" height="10" fill="#059669"/>
      <rect x="690" y="430" width="10" height="10" fill="#059669"/>
      <rect x="710" y="430" width="10" height="10" fill="#059669"/>
      <rect x="690" y="450" width="10" height="10" fill="#059669"/>
      <rect x="710" y="450" width="10" height="10" fill="#059669"/>
      
      <!-- Bottom Border -->
      <line x1="80" y1="510" x2="720" y2="510" stroke="white" stroke-opacity="0.2" stroke-width="1"/>
      <text x="80" y="530" font-family="Arial, sans-serif" font-size="9" fill="#a7f3d0">Soulbound Token • Lisk Sepolia</text>
      <text x="720" y="530" font-family="monospace" font-size="8" fill="#a7f3d0" text-anchor="end">sepolia-blockscout.lisk.com</text>
    </svg>
  `;

  return svg.trim();
}

/**
 * Upload certificate image to Pinata as PNG
 */
export async function uploadCertificateImage(
  certificateData: CertificateData
): Promise<string> {
  try {
    // Generate SVG
    const svgString = generateCertificateSVG(certificateData);
    
    // Send SVG to backend to convert to PNG and upload
    const response = await fetch('/api/upload/certificate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        svg: svgString,
        filename: `certificate-${certificateData.txHash.slice(0, 10)}.png`,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload certificate image');
    }
    
    const data = await response.json();
    return data.ipfsUrl; // Returns ipfs://...
  } catch (error) {
    console.error('Error uploading certificate:', error);
    // Fallback to a default image
    return 'ipfs://bafkreiexample/kasturi-certificate.png';
  }
}
