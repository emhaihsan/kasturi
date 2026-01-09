# Kasturi Smart Contracts

Foundry workspace for the Kasturi protocol on Lisk (EVM).

Kasturi uses smart contracts to:

- Issue non-transferable learning credentials (SBT)
- Mint and redeem ERC-1155 vouchers
- Manage the utility token used to purchase vouchers

---

## Contracts

- **KasturiToken**: ERC-20 utility token (KSTR)
- **KasturiSBT**: Soulbound credential token (non-transferable)
- **KasturiVoucher**: ERC-1155 voucher contract
- **Kasturi**: main coordinator contract

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

1. **Learn**: complete lessons in the app.
2. **Claim Credential**: once requirements are met, the backend issues an SBT.
3. **Get Rewards**: users can purchase vouchers using KSTR.
4. **Redeem**: vouchers are redeemed by burning ERC-1155 balances.
5. **Verify**: credentials and vouchers can be verified in a block explorer.

## Prerequisites

- Foundry (`forge`, `cast`)
- A funded EVM wallet on the target network (Lisk Sepolia for testing)

## Setup

```bash
forge install
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

## Deploy (Lisk Sepolia)

```bash
export PRIVATE_KEY=<YOUR_PRIVATE_KEY>

forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://rpc.sepolia-api.lisk.com \
  --broadcast
```

## Scripts

### Update ERC-1155 Voucher Metadata URI

ERC-1155 vouchers use a base URI for metadata (name, description, image). Wallets and explorers use this to display voucher details.

Script:

- `script/SetVoucherURI.s.sol`

Usage:

```bash
export PRIVATE_KEY=<YOUR_PRIVATE_KEY>

forge script script/SetVoucherURI.s.sol:SetVoucherURIScript \
  --rpc-url https://rpc.sepolia-api.lisk.com \
  --broadcast
```

More details: `UPDATE_VOUCHER_URI.md`

## Contract Addresses

After deployment, update these addresses:

| Contract | Lisk Sepolia | Notes |
|----------|--------------|------|
| KasturiToken | TBD | ERC-20 token (KSTR) |
| KasturiSBT | TBD | Soulbound credential |
| KasturiVoucher | TBD | ERC-1155 vouchers |
| Kasturi | TBD | Main coordinator |

## Block Explorer

Lisk Sepolia Blockscout:

- https://sepolia-blockscout.lisk.com

## Security

- SBT credentials are **non-transferable** (soulbound)
- Only authorized operators can add EXP
- Utility NFTs can only be redeemed once

## License

MIT
