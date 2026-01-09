// Script to create voucher types on the KasturiVoucher contract
// Run with: npx ts-node scripts/create-vouchers.ts

import { createWalletClient, createPublicClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { liskSepolia } from 'viem/chains';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const KASTURI_VOUCHER = process.env.NEXT_PUBLIC_KASTURI_VOUCHER as `0x${string}`;
const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
const RPC_URL = process.env.NEXT_PUBLIC_LISK_RPC_URL;

// Voucher types to create
const VOUCHERS = [
  {
    name: 'Free Soto Banjar at Bang Amat Under The Bridge',
    price: parseEther('500'), // 500 KSTR tokens
  },
  {
    name: '50% Off Phinisi River Cruise Barito',
    price: parseEther('300'), // 300 KSTR tokens
  },
  {
    name: '30% Off Boat Rental to Lok Baintan Floating Market',
    price: parseEther('200'), // 200 KSTR tokens
  },
];

const KasturiVoucherABI = [
  {
    type: 'function',
    name: 'createVoucherType',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'price', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'totalVoucherTypes',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getVoucherType',
    inputs: [{ name: 'voucherId', type: 'uint256' }],
    outputs: [
      { name: 'name', type: 'string' },
      { name: 'price', type: 'uint256' },
      { name: 'active', type: 'bool' },
      { name: 'totalMinted', type: 'uint256' },
      { name: 'totalRedeemed', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
];

async function main() {
  if (!PRIVATE_KEY || !KASTURI_VOUCHER || !RPC_URL) {
    console.error('Missing environment variables');
    process.exit(1);
  }

  const account = privateKeyToAccount(PRIVATE_KEY.startsWith('0x') ? PRIVATE_KEY : `0x${PRIVATE_KEY}`);
  
  const publicClient = createPublicClient({
    chain: liskSepolia,
    transport: http(RPC_URL),
  });

  const walletClient = createWalletClient({
    account,
    chain: liskSepolia,
    transport: http(RPC_URL),
  });

  console.log('Creating voucher types on KasturiVoucher contract...');
  console.log('Contract:', KASTURI_VOUCHER);
  console.log('Account:', account.address);
  console.log('');

  // Check existing voucher types
  const totalTypes = await publicClient.readContract({
    address: KASTURI_VOUCHER,
    abi: KasturiVoucherABI,
    functionName: 'totalVoucherTypes',
  }) as bigint;

  console.log(`Current voucher types: ${totalTypes}`);

  if (totalTypes > 0n) {
    console.log('\nExisting vouchers:');
    for (let i = 1n; i <= totalTypes; i++) {
      const [name, price, active] = await publicClient.readContract({
        address: KASTURI_VOUCHER,
        abi: KasturiVoucherABI,
        functionName: 'getVoucherType',
        args: [i],
      }) as [string, bigint, boolean, bigint, bigint];
      console.log(`  ${i}: ${name} - ${Number(price) / 1e18} KSTR (active: ${active})`);
    }
    console.log('\nSkipping creation as vouchers already exist.');
    return;
  }

  // Create each voucher type
  for (const voucher of VOUCHERS) {
    console.log(`\nCreating: ${voucher.name}`);
    console.log(`  Price: ${Number(voucher.price) / 1e18} KSTR`);

    const hash = await walletClient.writeContract({
      address: KASTURI_VOUCHER,
      abi: KasturiVoucherABI,
      functionName: 'createVoucherType',
      args: [voucher.name, voucher.price],
    });

    console.log(`  TX: ${hash}`);
    
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`  Status: ${receipt.status === 'success' ? '✓ Success' : '✗ Failed'}`);
  }

  // Verify creation
  const newTotalTypes = await publicClient.readContract({
    address: KASTURI_VOUCHER,
    abi: KasturiVoucherABI,
    functionName: 'totalVoucherTypes',
  }) as bigint;

  console.log(`\n✓ Total voucher types created: ${newTotalTypes}`);
}

main().catch(console.error);
