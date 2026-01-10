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
    name: 'Free Bowl of Soto Banjar at Bang Amat',
    description: 'Enjoy a free bowl of authentic Soto Banjar at the legendary Bang Amat stall under the bridge. Soto Banjar is famous for its savory clear broth, potato fritters, and boiled eggs.',
    image: '/sotobanjar.jpg',
    external_url: 'https://kasturi.fun/rewards',
    attributes: [
      { trait_type: 'Type', value: 'Food' },
      { trait_type: 'Discount', value: '100%' },
      { trait_type: 'Location', value: 'Banjarmasin' },
      { trait_type: 'Price', value: '500 KSTR' },
    ],
  },
  '4': {
    name: '50% Off Phinisi Boat Tour on Barito River',
    description: 'Explore the beauty of Barito River on a traditional Phinisi boat. Enjoy stunning sunset views and an unforgettable sailing experience at 50% off.',
    image: '/phinisi.jpg',
    external_url: 'https://kasturi.fun/rewards',
    attributes: [
      { trait_type: 'Type', value: 'Tourism' },
      { trait_type: 'Discount', value: '50%' },
      { trait_type: 'Location', value: 'Barito River' },
      { trait_type: 'Price', value: '300 KSTR' },
    ],
  },
  '5': {
    name: '30% Off Boat Rental to Lok Baintan Floating Market',
    description: 'Visit the legendary Lok Baintan floating market with 30% off boat rental. Experience the traditional market on water that has existed for hundreds of years.',
    image: '/pasarterapung.jpg',
    external_url: 'https://kasturi.fun/rewards',
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
