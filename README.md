# Kasturi App

> A focused demo for structured regional language learning with on-chain proof of completion.

Kasturi is a learning dApp that helps newcomers (*perantau*) and other movers integrate faster by learning **Bahasa Banjar** through structured lessons and earning a **non-transferable credential** on **Lisk (EVM)** as verifiable proof of completion.

This project is built as a **Kasturi demo submission** for the **Lisk Builders Challenge Round 3**, with a focus on the end-to-end flow: learn → complete the program → obtain an on-chain credential → redeem benefits.

---

## Problem & Vision

### Problem

- Local language learning content is often scattered, informal, and hard to measure in terms of progress.
- There is no standard way to prove that someone has completed a learning program.
- For *perantau* (migrants / newcomers), this slows down social and professional integration in the destination region.

### Kasturi’s Solution

Kasturi offers:

- **Structured Bahasa Banjar program**: lessons organized into modules with clear progress tracking.
- **Non-financial EXP tracking**: EXP represents learning progress, not monetary value.
- **Non-transferable credential (SBT)**: on-chain proof that a user has completed a specific program.
- **Utility NFT**: a one-time claimable benefit after program completion (e.g., voucher or access).
- **Public verification**: anyone can verify the credential without accessing sensitive data.

---

## System Architecture

At a high level, Kasturi is composed of:

```text
Learner / Verifier
        ↓
Frontend (Next.js 16, React 19)
        ↓
Off-chain logic (EXP rules & credential eligibility)
        ↓
Lisk smart contracts (EXP ledger, Credential SBT, Utility NFT)
        ↓
Public verification (UI + explorer / Blockscout)
```

### Main Components

#### Frontend (Next.js / React)

- **Learning page**: shows Bahasa Banjar lessons, progress, and EXP status.
- **Completion page**: trigger point to issue credentials when requirements are met.
- **Verification page**: displays credentials / NFTs and links to Blockscout or other explorers for on-chain proof.
- **Demo-friendly UX**: designed so the full flow can be demonstrated quickly during judging sessions.

#### Off-chain Logic

- Controls **EXP rules** (e.g., EXP per lesson/module).
- Checks **credential eligibility criteria** (e.g., all mandatory modules completed).
- Decides when to call Lisk contracts to:
  - Record EXP.
  - Issue the credential SBT.
  - Mint the Utility NFT for benefits.

#### Smart Contracts (Lisk EVM)

- **EXP Ledger Contract**
  - Stores non-financial EXP per address.
  - Designed so EXP cannot be transferred or traded.
- **Credential SBT Contract**
  - Issues a Soulbound Token per completed program.
  - Non-transferable—can only be issued or (optionally) revoked by an admin.
- **Utility NFT Contract**
  - Mints an NFT that can be redeemed once after the credential is issued.
  - Marks redeemed status so it cannot be used twice.
- **Verification Helpers**
  - Easy-to-use functions to check:
    - Does a given address own the credential?
    - How much EXP has been accumulated?
    - Has the Utility NFT been redeemed?

---

## Project Goals (Hackathon Scope)

For the **Lisk Builders Challenge Round 3**, Kasturi is scoped to stay focused and demo-ready:

1. **Single language program**: Bahasa Banjar, with enough lessons to showcase the full flow.
2. **Progress tracking**:
   - Each lesson grants EXP.
   - The UI shows EXP growth and completion status.
3. **Credential issuance**:
   - When requirements are met (EXP / modules complete), the contract issues an SBT.
4. **Utility NFT**:
   - The credential unlocks the right to claim an NFT that can be redeemed once.
5. **Public verification experience**:
   - Link to Blockscout (or another Lisk explorer) to show on-chain proof.
   - A verification page in the frontend to demo verification to judges.

---

## Repository Structure

```text
kasturiapp/
├─ contract/        # Foundry workspace for Lisk (EVM) smart contracts
├─ frontend/        # Next.js 16 app for learner & verifier UX
└─ README.md        # Kasturi project documentation (this file)
```

---

## How to Run the Project (Quick)

### Frontend

- Tech stack: **Next.js 16**, **React 19**, TypeScript, Tailwind (v4).
- Purpose: learning UI, progress view, credential trigger, and public verification.

Basic steps:

```bash
cd frontend
npm install
npm run dev                      # http://localhost:3000
```

### Smart Contracts

- Tech stack: **Foundry** on the **Lisk (EVM)** network.
- Purpose: EXP ledger, Credential SBT, Utility NFT.

General flow:

```bash
cd contract
forge build
forge test
# Deploy / run scripts with your Lisk RPC configuration
```

## Project Status

- ✅ Basic application structure (Next.js + Foundry) ready.
- ✅ Architecture design: EXP, Credential SBT, Utility NFT, and verification flow defined.
- 🚧 Detailed lesson content, EXP rules, and contract–frontend wiring in progress.
- 🔜 Deploy to Lisk testnet, prepare demo scenarios, and set up public verification links.

---

**Kasturi aims to be a concrete example of how blockchain (Lisk) can be used in a lean but meaningful way to solve a real social problem: accelerating newcomer (*perantau*) integration through structured, provable local language learning.**
