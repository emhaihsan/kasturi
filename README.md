# Kasturi

Kasturi is a learning dApp for Indonesian regional languages. Learners complete structured lessons (starting with **Bahasa Banjar**), then receive a **verifiable on-chain credential** (a non-transferable SBT) as proof of completion. Learners can also redeem **ERC-1155 vouchers** for real-world benefits.

This repository was built for the **Lisk Builders Challenge**.

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

## Demo Flow (Judge-friendly)

1. Learn a short lesson
2. See progress tracked in the UI
3. Claim a completion credential (SBT)
4. Purchase/redeem a voucher (ERC-1155)
5. Verify everything publicly on the explorer

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
