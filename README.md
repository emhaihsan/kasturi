# Kasturi

Kasturi is a learning dApp for Indonesian regional languages. Learners complete structured lessons, earn progress points, and receive a verifiable on-chain credential (SBT). They can also redeem ERC-1155 vouchers for real-world benefits.

This repository was built as a demo submission for the Lisk Builders Challenge.

---

## Monorepo Structure

```text
kasturiapp/
├─ frontend/        # Next.js app (learner UX + APIs)
├─ contract/        # Foundry workspace (Lisk Sepolia / Lisk EVM)
└─ README.md        # You are here
```

---

## Components

### Frontend (Next.js)

- User experience for lessons, progress, wallet, rewards, and verification.
- Server routes (Next.js Route Handlers) for DB reads/writes and server-side contract calls.
- Voucher metadata endpoint for ERC-1155: `GET /api/voucher/[id]`.

See: `frontend/README.md`

### Smart Contracts (Foundry)

Deployed on Lisk (EVM). Key contracts:

- **KasturiToken**: ERC-20 utility token (KSTR).
- **KasturiSBT**: Soulbound credential contract (non-transferable).
- **KasturiVoucher**: ERC-1155 vouchers (multiple voucher types per contract).
- **Kasturi**: main coordinator contract.

See: `contract/README.md`

---

## Quick Start (Local)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Contracts

```bash
cd contract
forge build
forge test
```

---

## Deployment Notes

- The frontend was verified to build successfully via `npm run build`.
- Configure environment variables in your hosting provider (recommended: Vercel). Use `frontend/.env.example` as a reference.
- ERC-1155 voucher metadata display depends on the on-chain base URI. The repo includes a Foundry script to update the base URI.

---

## Documentation

- Frontend setup: `frontend/README.md`
- Contract setup & deployment: `contract/README.md`
