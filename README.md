# Kasturi

Kasturi is a learning dApp for Indonesian regional languages. Learners complete structured lessons (starting with **Bahasa Banjar**), then receive a **verifiable on-chain credential** (a non-transferable SBT) as proof of completion. Learners can also redeem **ERC-1155 vouchers** for real-world benefits.

This repository was built for the **Lisk Builders Challenge Round 3**.

KASTURI TOKEN=0x7F120b4E0Fa01B425C3FCc8A3F6d29d5E853F342
KASTURI SBT=0x19c9A5AF2d19fC596FcEA5Ce3C35Db1FECd876Ba
KASTURI VOUCHER=0x7614C13cD1b629262161de25857AEb502cB54499
KASTURI MAIN=0x7c9FC13bFD2AE91e1eE41d0281120A47454a6Eb5

---

## The Problem

Indonesia has hundreds of regional languages that are still used in daily life, but for people moving between regions (students, workers, families), learning often depends on luck: local friends, long immersion, or unstructured online videos.

Even when someone makes real effort, progress is hard to measure and outcomes are hard to trust—there is no credible, portable proof that learning actually happened.

---

## The Solution

Kasturi provides:

- A structured learning path (modules and lessons) focused on real-life conversations
- A simple Web2-like user experience for progress tracking
- A verifiable completion credential (SBT) that cannot be transferred
- ERC-1155 vouchers that represent practical rewards and can be redeemed
- Public verification (anyone can verify without logging in)

Blockchain is used only where trust truly matters: **proof, integrity, and verification**.

---

## Why Lisk

Kasturi needs credibility, not complexity.

By deploying on **Lisk (EVM)**:

- Credentials are public, tamper-resistant, and verifiable by third parties
- Verifiers do not need to trust Kasturi’s backend
- Vouchers can be displayed by wallets/explorers via standard token metadata

---

## High-Level Architecture

```text
Learner / Verifier
        ↓
Frontend (Next.js)
        ↓
Off-chain logic (completion eligibility, content, UX)
        ↓
Lisk smart contracts (SBT credential, ERC-1155 vouchers, token)
        ↓
Public verification (Blockscout + app UI)
```

**Trust boundary:** the app decides *when* someone completes; the chain proves *that* completion was issued.


---

## Monorepo Structure

```text
kasturiapp/
├─ frontend/        # Next.js app (learner UX + APIs)
├─ contract/        # Foundry workspace (Lisk Sepolia / Lisk EVM)
└─ README.md        # You are here
```

---

## Documentation

- Frontend setup and env vars: `frontend/README.md`
- Contracts, deployment, scripts: `contract/README.md`
