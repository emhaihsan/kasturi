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
 * Generate certificate SVG as a data URL
 * This creates an SVG image that can be uploaded to IPFS
 */
export function generateCertificateSVG(data: CertificateData): string {
  const formattedDate = new Date(data.issuedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const shortAddress = `${data.recipientAddress.slice(0, 6)}...${data.recipientAddress.slice(-4)}`;
  const shortTxHash = `${data.txHash.slice(0, 10)}...${data.txHash.slice(-8)}`;

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
      
      <!-- Header -->
      <text x="400" y="80" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">KASTURI</text>
      <text x="400" y="105" font-family="Arial, sans-serif" font-size="12" fill="#d1fae5" text-anchor="middle" letter-spacing="3">LEARN • EARN • PRESERVE</text>
      
      <!-- Award Icon (simplified) -->
      <circle cx="400" cy="180" r="30" fill="#fbbf24" opacity="0.9"/>
      <polygon points="400,160 410,185 390,185" fill="white"/>
      <circle cx="400" cy="180" r="15" fill="none" stroke="white" stroke-width="2"/>
      
      <!-- Certificate Title -->
      <text x="400" y="240" font-family="Arial, sans-serif" font-size="14" fill="#d1fae5" text-anchor="middle">CERTIFICATE OF COMPLETION</text>
      <text x="400" y="275" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">${data.programName}</text>
      
      <!-- Recipient Info -->
      <text x="400" y="315" font-family="Arial, sans-serif" font-size="12" fill="#d1fae5" text-anchor="middle">This is to certify that</text>
      <text x="400" y="345" font-family="Arial, sans-serif" font-size="22" font-weight="600" fill="white" text-anchor="middle">${data.recipientName}</text>
      <text x="400" y="370" font-family="monospace" font-size="11" fill="#a7f3d0" text-anchor="middle">${shortAddress}</text>
      <text x="400" y="400" font-family="Arial, sans-serif" font-size="11" fill="#d1fae5" text-anchor="middle">has successfully completed the ${data.language || 'language'} learning program</text>
      
      <!-- Footer -->
      <text x="120" y="480" font-family="Arial, sans-serif" font-size="10" fill="#a7f3d0">Issue Date</text>
      <text x="120" y="500" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="white">${formattedDate}</text>
      
      <!-- Shield Icon (simplified) -->
      <rect x="620" y="465" width="30" height="35" fill="#a7f3d0" opacity="0.3" rx="2"/>
      <text x="660" y="480" font-family="Arial, sans-serif" font-size="10" fill="#a7f3d0">Verified On-Chain</text>
      <text x="660" y="500" font-family="monospace" font-size="10" fill="white">${shortTxHash}</text>
      
      <!-- Bottom Border -->
      <line x1="80" y1="520" x2="720" y2="520" stroke="white" stroke-opacity="0.2" stroke-width="1"/>
      <text x="80" y="540" font-family="Arial, sans-serif" font-size="9" fill="#a7f3d0">Soulbound Token • Lisk Sepolia</text>
      <text x="720" y="540" font-family="monospace" font-size="8" fill="#a7f3d0" text-anchor="end">sepolia-blockscout.lisk.com</text>
    </svg>
  `;

  // Convert SVG to data URL
  const svgBase64 = Buffer.from(svg.trim()).toString('base64');
  return `data:image/svg+xml;base64,${svgBase64}`;
}

/**
 * Upload certificate image to Pinata
 */
export async function uploadCertificateImage(
  certificateData: CertificateData
): Promise<string> {
  try {
    // Generate SVG
    const svgDataUrl = generateCertificateSVG(certificateData);
    
    // Convert data URL to buffer
    const base64Data = svgDataUrl.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Upload to Pinata via API route
    const formData = new FormData();
    const blob = new Blob([buffer], { type: 'image/svg+xml' });
    formData.append('file', blob, `certificate-${certificateData.txHash.slice(0, 10)}.svg`);
    
    const response = await fetch('/api/upload/certificate', {
      method: 'POST',
      body: formData,
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
