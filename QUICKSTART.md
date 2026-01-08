# Kasturi Quick Start Guide

Panduan cepat untuk menjalankan Kasturi setelah setup database.

---

## ✅ Status Saat Ini

- [x] Database schema ready
- [x] Prisma configured
- [x] 5 lessons Bahasa Banjar seeded
- [x] API routes created
- [x] Pinata integration ready
- [x] Admin dashboard created
- [x] Contract integration ready

---

## 🚀 Langkah Selanjutnya

### 1. Start Development Server

```bash
cd kasturiapp/frontend
npm run dev
```

Buka http://localhost:3000

---

### 2. Setup Pinata (Optional - untuk SBT metadata)

1. Buka https://app.pinata.cloud → Signup
2. **API Keys** → **+ New Key**
3. Enable: `pinFileToIPFS`, `pinJSONToIPFS`
4. Update `.env.local`:

```bash
PINATA_API_KEY=your_key_here
PINATA_SECRET_KEY=your_secret_here
```

---

### 3. Akses Admin Dashboard

Buka: http://localhost:3000/admin

**Fitur:**
- Lihat semua lessons per program
- Tambah lesson baru dengan form
- Edit/delete lessons
- Kelola vocabulary dan exercises

---

### 4. Test API Endpoints

#### Get Lessons
```bash
curl http://localhost:3000/api/lessons
```

#### Complete Lesson (requires wallet)
```bash
curl -X POST http://localhost:3000/api/lessons/LESSON_ID/complete \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "0x...", "score": 100}'
```

#### Claim Credential
```bash
curl -X POST http://localhost:3000/api/credentials/claim \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "0x...", "programId": "0xdef72bc24cd5c4917b5a24050177e5ed37738b89d80f563406a787d04ebe47e1"}'
```

---

## 📋 Program ID untuk Testing

**Bahasa Banjar Basic:**
```
0xdef72bc24cd5c4917b5a24050177e5ed37738b89d80f563406a787d04ebe47e1
```

Gunakan ID ini saat:
- Claim credential via API
- Issue credential via smart contract

---

## 🎯 Demo Flow

### Flow 1: User Learning Journey

1. **User connects wallet** (Privy)
2. **View lessons** → GET `/api/lessons`
3. **Complete lesson** → POST `/api/lessons/{id}/complete`
   - Backend mints tokens on-chain
   - Progress saved to database
4. **Complete all 5 lessons**
5. **Claim credential** → POST `/api/credentials/claim`
   - Backend issues SBT on-chain
   - Metadata uploaded to Pinata (if configured)

### Flow 2: Admin Lesson Management

1. Open http://localhost:3000/admin
2. Select "Bahasa Banjar Basic" program
3. Click "Tambah Lesson"
4. Fill form:
   - Title: "Lesson 6: Cuaca (Weather)"
   - Description: "Learn weather terms"
   - EXP: 10
   - Add vocabulary (Banjar, Indonesian, English)
   - Add exercises (multiple choice)
5. Click "Simpan Lesson"
6. New lesson appears in list

---

## 🔗 Contract Addresses (Lisk Sepolia)

| Contract | Address |
|----------|---------|
| KasturiToken | `0x7d04aac310638b6ef69af7c653c400c6265da9b2` |
| KasturiSBT | `0x994275a953074accf218c9b5b77ea55cef00d17b` |
| KasturiVoucher | `0x56331e159abc80d772cc617cb6ed3d5961e566e2` |

**Backend Wallet:** `0x694b4107ce4c7b14711e26c8bb7cb3795cd8bd84`

---

## 🧪 Testing Checklist

- [ ] Frontend loads without errors
- [ ] Can view lessons list
- [ ] Admin dashboard accessible
- [ ] Can add new lesson via admin
- [ ] API endpoints respond correctly
- [ ] Database queries work
- [ ] (Optional) Pinata connection works

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app/admin/page.tsx` | Admin dashboard untuk manage lessons |
| `app/api/lessons/route.ts` | GET lessons |
| `app/api/lessons/[id]/complete/route.ts` | POST complete lesson + mint tokens |
| `app/api/credentials/claim/route.ts` | POST claim SBT credential |
| `app/api/admin/lessons/route.ts` | POST/PUT/DELETE lessons (admin) |
| `lib/backend-wallet.ts` | Server-side contract calls |
| `lib/pinata.ts` | IPFS metadata upload |
| `lib/hooks/use-contracts.ts` | React hooks untuk contracts |
| `lib/hooks/use-lessons.ts` | React hooks untuk lessons |

---

## 🐛 Troubleshooting

### Frontend tidak load
```bash
# Check if dev server running
npm run dev

# Check for errors in terminal
```

### Database connection error
```bash
# Verify DATABASE_URL in .env.local
# Test connection
npx prisma studio
```

### Contract calls fail
1. Check backend wallet has ETH for gas
2. Verify contract addresses in `.env.local`
3. Check backend wallet is minter role

---

## 🎨 Next Steps (Optional)

1. **Build frontend UI** untuk learning pages
2. **Add authentication** dengan Privy
3. **Implement lesson player** dengan vocabulary dan exercises
4. **Add progress tracking UI**
5. **Create certificate display page**
6. **Add voucher marketplace**

---

## 📖 Full Documentation

Lihat `SETUP.md` untuk:
- Deploy ke Railway
- Setup Pinata detail
- Adding lessons programmatically
- End-to-end testing guide
