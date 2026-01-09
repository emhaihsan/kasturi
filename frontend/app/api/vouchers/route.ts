import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { liskSepolia } from 'viem/chains';
import KasturiVoucherABI from '@/lib/abis/KasturiVoucher.json';

const KASTURI_VOUCHER = process.env.NEXT_PUBLIC_KASTURI_VOUCHER as `0x${string}`;

// GET /api/vouchers - Get available voucher types
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    const publicClient = createPublicClient({
      chain: liskSepolia,
      transport: http(process.env.NEXT_PUBLIC_LISK_RPC_URL),
    });

    // Get total voucher types count
    const totalTypes = await publicClient.readContract({
      address: KASTURI_VOUCHER,
      abi: KasturiVoucherABI.abi,
      functionName: 'totalVoucherTypes',
    }) as bigint;
    
    // voucher IDs start from 1, so nextVoucherId = totalTypes + 1
    const nextVoucherId = totalTypes + 1n;

    const voucherTypes = [];

    // Fetch all voucher types
    for (let i = 1n; i < nextVoucherId; i++) {
      try {
        const [name, price, isActive] = await publicClient.readContract({
          address: KASTURI_VOUCHER,
          abi: KasturiVoucherABI.abi,
          functionName: 'getVoucherType',
          args: [i],
        }) as [string, bigint, boolean];

        if (isActive) {
          let balance = 0n;
          if (walletAddress) {
            balance = await publicClient.readContract({
              address: KASTURI_VOUCHER,
              abi: KasturiVoucherABI.abi,
              functionName: 'balanceOf',
              args: [walletAddress, i],
            }) as bigint;
          }

          voucherTypes.push({
            id: i.toString(),
            name,
            price: price.toString(),
            isActive,
            userBalance: balance.toString(),
          });
        }
      } catch (e) {
        // Skip invalid voucher IDs
        continue;
      }
    }

    return NextResponse.json({ vouchers: voucherTypes });
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vouchers' },
      { status: 500 }
    );
  }
}
