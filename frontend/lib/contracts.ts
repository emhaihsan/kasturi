// Contract addresses and ABIs for Kasturi smart contracts
// Deployed on Lisk Sepolia (Chain ID: 4202)

export const CHAIN_ID = 4202;
export const RPC_URL = process.env.NEXT_PUBLIC_LISK_RPC_URL || 'https://rpc.sepolia-api.lisk.com';

// Contract Addresses (Lisk Sepolia)
export const CONTRACTS = {
  KasturiToken: '0x7F120b4E0Fa01B425C3FCc8A3F6d29d5E853F342' as `0x${string}`,
  KasturiSBT: '0x19c9A5AF2d19fC596FcEA5Ce3C35Db1FECd876Ba' as `0x${string}`,
  KasturiVoucher: '0x7614C13cD1b629262161de25857AEb502cB54499' as `0x${string}`,
  Kasturi: '0x7c9FC13bFD2AE91e1eE41d0281120A47454a6Eb5' as `0x${string}`,
} as const;

// Deployer/Backend wallet address
export const BACKEND_ADDRESS = '0x694b4107ce4c7b14711e26c8bb7cb3795cd8bd84' as `0x${string}`;

// ============================================================================
// ABIs (Only the functions we need)
// ============================================================================

export const KasturiTokenABI = [
  // Read functions
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getClaimedEXP',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'canClaimFaucet',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'timeUntilNextClaim',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'faucetAmount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'faucetEnabled',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Write functions
  {
    inputs: [],
    name: 'claimFaucet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'expAmount', type: 'uint256' },
      { name: 'tokenAmount', type: 'uint256' },
    ],
    name: 'claimTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: false, name: 'expAmount', type: 'uint256' },
      { indexed: false, name: 'tokenAmount', type: 'uint256' },
    ],
    name: 'TokensClaimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
    ],
    name: 'FaucetClaimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
    ],
    name: 'TokensBurned',
    type: 'event',
  },
] as const;

export const KasturiSBTABI = [
  // Read functions
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'programId', type: 'bytes32' },
    ],
    name: 'hasCredential',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'programId', type: 'bytes32' },
    ],
    name: 'getCredentialToken',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'programId', type: 'bytes32' },
    ],
    name: 'getUserStatus',
    outputs: [
      { name: 'completed', type: 'bool' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'issuedAt', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalCredentials',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Write functions
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'programId', type: 'bytes32' },
    ],
    name: 'issueCredential',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'newTokenURI', type: 'string' },
    ],
    name: 'setTokenURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: true, name: 'programId', type: 'bytes32' },
      { indexed: false, name: 'tokenId', type: 'uint256' },
    ],
    name: 'CredentialIssued',
    type: 'event',
  },
] as const;

export const KasturiVoucherABI = [
  // Read functions
  {
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'id', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'voucherId', type: 'uint256' }],
    name: 'getVoucherType',
    outputs: [
      { name: 'name', type: 'string' },
      { name: 'price', type: 'uint256' },
      { name: 'active', type: 'bool' },
      { name: 'totalMinted', type: 'uint256' },
      { name: 'totalRedeemed', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'voucherId', type: 'uint256' },
    ],
    name: 'getVoucherBalance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'voucherId', type: 'uint256' },
    ],
    name: 'getUserRedemptions',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalVoucherTypes',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Write functions
  {
    inputs: [
      { name: 'voucherId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'purchaseVoucher',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'voucherId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'redeemVoucher',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'voucherId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'grantVoucher',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: true, name: 'voucherId', type: 'uint256' },
      { indexed: false, name: 'amount', type: 'uint256' },
      { indexed: false, name: 'totalPrice', type: 'uint256' },
    ],
    name: 'VoucherPurchased',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: true, name: 'voucherId', type: 'uint256' },
      { indexed: false, name: 'amount', type: 'uint256' },
    ],
    name: 'VoucherRedeemed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: true, name: 'voucherId', type: 'uint256' },
      { indexed: false, name: 'amount', type: 'uint256' },
    ],
    name: 'VoucherGranted',
    type: 'event',
  },
] as const;

// ERC20 approval for voucher purchase
export const ERC20ApprovalABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
