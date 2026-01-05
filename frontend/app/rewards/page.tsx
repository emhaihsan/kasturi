'use client';

import { useState } from 'react';
import { Star, Coins, Gift, ArrowRight, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { vouchers, exchangeRate } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { usePrivy } from '@privy-io/react-auth';

export default function RewardsPage() {
  const { user, convertExpToTokens, addVoucher } = useAppStore();
  const { authenticated, login } = usePrivy();
  const [expToConvert, setExpToConvert] = useState(100);
  const [isConverting, setIsConverting] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);

  const handleConvertExp = async () => {
    if (!user || user.totalExp < expToConvert) return;
    setIsConverting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    convertExpToTokens(expToConvert);
    setIsConverting(false);
  };

  const handlePurchaseVoucher = async (voucher: typeof vouchers[0]) => {
    if (!user || user.tokenBalance < voucher.tokenCost) return;
    setIsPurchasing(voucher.id);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    addVoucher({ ...voucher, redeemed: false });
    setIsPurchasing(null);
  };

  const tokenAmount = Math.floor(expToConvert / exchangeRate.expToToken);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
            <Gift className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Rewards & Voucher</h1>
          <p className="text-gray-600 mb-8">
            Login untuk melihat EXP, token, dan voucher yang bisa Anda tukarkan.
          </p>
          <Button size="lg" onClick={() => login()}>
            Login untuk Melanjutkan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Rewards & Voucher</h1>
          <p className="text-xl text-gray-600">
            Tukarkan EXP menjadi token, lalu gunakan token untuk mendapatkan voucher NFT
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-amber-100 text-sm">Total EXP</p>
                  <p className="text-3xl font-bold">{user?.totalExp || 0}</p>
                </div>
              </div>
              <p className="text-amber-100 text-sm">
                Dapatkan EXP dengan menyelesaikan pelajaran
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-emerald-100 text-sm">Token Balance</p>
                  <p className="text-3xl font-bold">{user?.tokenBalance || 0}</p>
                </div>
              </div>
              <p className="text-emerald-100 text-sm">
                Tukar EXP untuk mendapatkan token
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-purple-100 text-sm">Voucher NFT</p>
                  <p className="text-3xl font-bold">{user?.vouchers?.length || 0}</p>
                </div>
              </div>
              <p className="text-purple-100 text-sm">
                Voucher yang sudah Anda miliki
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Tukar EXP ke Token
              </h2>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Star className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dari EXP</p>
                      <input
                        type="number"
                        value={expToConvert}
                        onChange={(e) => setExpToConvert(Math.max(10, parseInt(e.target.value) || 0))}
                        className="text-2xl font-bold text-gray-900 bg-transparent w-24 outline-none"
                        min={10}
                        step={10}
                      />
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm text-gray-500 text-right">Menjadi Token</p>
                      <p className="text-2xl font-bold text-emerald-600">{tokenAmount}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Coins className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Rate: {exchangeRate.expToToken} EXP = 1 Token
                </p>
              </div>

              {user && user.totalExp < expToConvert && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-3 rounded-xl mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">EXP tidak cukup. Anda memiliki {user.totalExp} EXP.</span>
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleConvertExp}
                disabled={!user || user.totalExp < expToConvert || isConverting}
                isLoading={isConverting}
              >
                {isConverting ? 'Menukar...' : 'Tukar Sekarang'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">Riwayat Voucher Anda</h2>
            </CardHeader>
            <CardContent>
              {user?.vouchers && user.vouchers.length > 0 ? (
                <div className="space-y-3">
                  {user.vouchers.map((voucher) => (
                    <div
                      key={voucher.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${
                        voucher.redeemed ? 'bg-gray-50 border-gray-200' : 'bg-emerald-50 border-emerald-200'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                        <Gift className={`w-6 h-6 ${voucher.redeemed ? 'text-gray-400' : 'text-emerald-600'}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{voucher.name}</p>
                        <p className="text-sm text-gray-500">
                          {voucher.redeemed ? 'Sudah ditukar' : 'Aktif'}
                        </p>
                      </div>
                      {voucher.redeemed && <Check className="w-5 h-5 text-gray-400" />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Gift className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Belum ada voucher. Tukar token untuk mendapatkan voucher!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Katalog Voucher NFT</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vouchers.map((voucher) => {
              const canPurchase = user && user.tokenBalance >= voucher.tokenCost;
              const alreadyOwned = user?.vouchers?.some((v) => v.id === voucher.id);

              return (
                <Card key={voucher.id} hover className="overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                    <Gift className="w-16 h-16 text-purple-400" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{voucher.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{voucher.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-emerald-600 font-bold">
                        <Coins className="w-4 h-4" />
                        <span>{voucher.tokenCost}</span>
                      </div>
                      {alreadyOwned ? (
                        <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          Dimiliki
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant={canPurchase ? 'primary' : 'outline'}
                          disabled={!canPurchase || isPurchasing === voucher.id}
                          isLoading={isPurchasing === voucher.id}
                          onClick={() => handlePurchaseVoucher(voucher)}
                        >
                          {isPurchasing === voucher.id ? 'Membeli...' : 'Beli'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
