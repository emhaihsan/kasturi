# Kasturi Frontend

This package contains the Kasturi web app (Next.js). It includes the learner UI, wallet and rewards screens, and server-side API routes for database access and contract interactions.

---

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Prisma (PostgreSQL)
- Viem (EVM / Lisk Sepolia)
- Privy (authentication + wallets)

---

## Local Development

```bash
npm install
npm run dev
```

The app will be available at:

- `http://localhost:3000`

---

## Environment Variables

Copy the example file and fill in values:

```bash
cp .env.example .env.local
```

Minimum required variables:

- `DATABASE_URL`
- `NEXT_PUBLIC_PRIVY_APP_ID`
- `NEXT_PUBLIC_LISK_RPC_URL`
- `NEXT_PUBLIC_LISK_CHAIN_ID`
- `NEXT_PUBLIC_KASTURI_TOKEN`
- `NEXT_PUBLIC_KASTURI_SBT`
- `NEXT_PUBLIC_KASTURI_VOUCHER`
- `NEXT_PUBLIC_KASTURI_MAIN`
- `BACKEND_PRIVATE_KEY`
- `BACKEND_ADDRESS`

Optional (for certificate metadata uploads):

- `PINATA_API_KEY` / `PINATA_SECRET_KEY` or `PINATA_JWT`
- `NEXT_PUBLIC_PINATA_GATEWAY`

---

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
```

Database / Prisma:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:studio
```

---

## Voucher Metadata (ERC-1155)

The ERC-1155 voucher contract uses a base URI. Wallets and explorers resolve metadata by calling the URI with the voucher ID.

This app exposes:

- `GET /api/voucher/[id]` (ERC-1155-compatible metadata JSON)

---


