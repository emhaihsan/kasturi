import { NextRequest, NextResponse } from 'next/server';

// Voucher metadata mapping - matches the voucher IDs on-chain
const VOUCHER_METADATA: Record<string, {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: Array<{ trait_type: string; value: string | number }>;
}> = {
  '1': {
    name: 'Voucher Makan',
    description: 'Food voucher for local culinary experiences.',
    image: '/icon.webp',
    attributes: [
      { trait_type: 'Type', value: 'Food' },
      { trait_type: 'Price', value: '100 KSTR' },
    ],
  },
  '2': {
    name: 'Voucher Wisata',
    description: 'Tourism voucher for local attractions.',
    image: '/icon.webp',
    attributes: [
      { trait_type: 'Type', value: 'Tourism' },
      { trait_type: 'Price', value: '500 KSTR' },
    ],
  },
  '3': {
    name: 'Gratis 1 Mangkok Soto Bang Amat Bawah Jembatan',
    description: 'Nikmati semangkuk soto Banjar autentik gratis di warung legendaris Bang Amat di bawah jembatan. Soto Banjar terkenal dengan kuah bening yang gurih, perkedel, dan telur rebus.',
    image: '/sotobanjar.jpg',
    external_url: 'https://kasturi.id/voucher/3',
    attributes: [
      { trait_type: 'Type', value: 'Food' },
      { trait_type: 'Discount', value: '100%' },
      { trait_type: 'Location', value: 'Banjarmasin' },
      { trait_type: 'Price', value: '500 KSTR' },
    ],
  },
  '4': {
    name: 'Diskon 50% Wisata Phinisi Sungai Barito',
    description: 'Jelajahi keindahan Sungai Barito dengan perahu Phinisi tradisional. Nikmati pemandangan sunset yang menakjubkan dan pengalaman berlayar yang tak terlupakan dengan diskon 50%.',
    image: '/phinisi.jpg',
    external_url: 'https://kasturi.id/voucher/4',
    attributes: [
      { trait_type: 'Type', value: 'Tourism' },
      { trait_type: 'Discount', value: '50%' },
      { trait_type: 'Location', value: 'Sungai Barito' },
      { trait_type: 'Price', value: '300 KSTR' },
    ],
  },
  '5': {
    name: 'Diskon 30% Sewa Perahu ke Pasar Terapung Lok Baintan',
    description: 'Kunjungi pasar terapung legendaris Lok Baintan dengan diskon 30% sewa perahu. Nikmati suasana pasar tradisional di atas air yang sudah ada sejak ratusan tahun lalu.',
    image: '/pasarterapung.jpg',
    external_url: 'https://kasturi.id/voucher/5',
    attributes: [
      { trait_type: 'Type', value: 'Tourism' },
      { trait_type: 'Discount', value: '30%' },
      { trait_type: 'Location', value: 'Lok Baintan' },
      { trait_type: 'Price', value: '200 KSTR' },
    ],
  },
};

// GET /api/voucher/[id] - Returns ERC-1155 metadata JSON
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const baseUrl = new URL(request.url).origin;
  
  const metadata = VOUCHER_METADATA[id];
  
  if (!metadata) {
    return NextResponse.json(
      { error: 'Voucher not found' },
      { status: 404 }
    );
  }

  // Convert relative image path to absolute URL
  const imageUrl = metadata.image.startsWith('http') 
    ? metadata.image 
    : `${baseUrl}${metadata.image}`;

  // Return ERC-1155 metadata format
  const response = {
    name: metadata.name,
    description: metadata.description,
    image: imageUrl,
    external_url: metadata.external_url || `${baseUrl}/rewards`,
    attributes: metadata.attributes || [],
  };

  return NextResponse.json(response, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
