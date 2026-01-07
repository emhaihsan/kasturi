# Kasturi Smart Contracts

Smart contracts for Kasturi - a platform for learning Indonesian regional languages with verifiable on-chain credentials.

## Overview

Kasturi uses blockchain technology to issue verifiable learning credentials:

- **KasturiEXP** - EXP ledger for tracking learning progress
- **KasturiSBT** - Soulbound Token (non-transferable) for learning credentials
- **KasturiUtility** - Utility NFT for rewards and vouchers
- **Kasturi** - Main coordinator contract

## Architecture

```
┌──────────────────┐
│     Kasturi      │  ← Main coordinator
│   (Controller)   │
└────────┬─────────┘
         │
    ┌────┼────┬────────────┐
    ▼    ▼    ▼            ▼
┌──────┐ ┌──────┐ ┌──────────────┐
│ EXP  │ │ SBT  │ │   Utility    │
│Ledger│ │Cred. │ │     NFT      │
└──────┘ └──────┘ └──────────────┘
```

## User Flow

1. **Learn** - Complete lessons, earn EXP
2. **Claim Credential** - Meet EXP requirement, claim SBT certificate
3. **Earn Rewards** - Spend EXP to mint Utility NFTs (vouchers)
4. **Redeem** - Redeem Utility NFTs for real benefits
5. **Verify** - Anyone can verify credentials publicly

## Setup

```bash
# Install dependencies
forge install

# Copy environment file
cp .env.example .env

# Edit .env with your private key
```

## Build & Test

```bash
# Build contracts
forge build

# Run tests
forge test

# Run tests with verbosity
forge test -vvv

# Check coverage
forge coverage
```

## Deploy to Lisk Sepolia Testnet

```bash
# Load environment variables
source .env

# Deploy
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://rpc.sepolia-api.lisk.com \
  --broadcast \
  --verify

# Or with explicit private key
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://rpc.sepolia-api.lisk.com \
  --private-key $PRIVATE_KEY \
  --broadcast
```

## Deploy to Lisk Mainnet

```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://rpc.api.lisk.com \
  --broadcast \
  --verify
```

## Contract Addresses

After deployment, update these addresses:

| Contract | Lisk Sepolia | Lisk Mainnet |
|----------|--------------|--------------|
| KasturiEXP | TBD | TBD |
| KasturiSBT | TBD | TBD |
| KasturiUtility | TBD | TBD |
| Kasturi | TBD | TBD |

## Verification on Blockscout

Contracts are automatically verified during deployment with `--verify` flag.

Manual verification:
```bash
forge verify-contract <CONTRACT_ADDRESS> src/Kasturi.sol:Kasturi \
  --chain-id 4202 \
  --verifier blockscout \
  --verifier-url https://sepolia-blockscout.lisk.com/api
```

## Key Functions

### For Backend (Owner Only)
- `completeLessonForUser(user, programId, expAmount)` - Award EXP after lesson completion

### For Users
- `claimCredential(programId)` - Claim SBT after meeting requirements
- `mintUtilityWithEXP(utilityType)` - Spend EXP to mint utility NFT

### For Verification (Public)
- `verifyCompletion(user, programId)` - Check if user completed a program
- `getUserLearningStatus(user, programId)` - Get user's learning status

## Program IDs

| Program | ID (bytes32) |
|---------|--------------|
| Bahasa Banjar | `keccak256("banjar")` |
| Bahasa Ambon | `keccak256("ambon")` |

## Security

- SBT credentials are **non-transferable** (soulbound)
- Only authorized operators can add EXP
- Utility NFTs can only be redeemed once

## License

MIT
