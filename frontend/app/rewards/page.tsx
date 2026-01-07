'use client';

import { useState } from 'react';
import { Star, Coins, Gift, ArrowRight, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { vouchers, exchangeRate } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { usePrivy } from '@privy-io/react-auth';
import { useInView } from '@/hooks/useInView';

export default function RewardsPage() {
  const { ref: heroRef, isInView: heroInView } = useInView();
  const { ref: statsRef, isInView: statsInView } = useInView();
  const { ref: contentRef, isInView: contentInView } = useInView();
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
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Gift className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Rewards & Vouchers</h1>
          <p className="text-neutral-600 mb-8">
            Login to view your EXP, tokens, and vouchers you can redeem.
          </p>
          <Button size="lg" onClick={() => login()}>
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" ref={heroRef}>
          <h1 className={`text-4xl font-bold text-neutral-900 mb-4 transition-all duration-700 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Rewards & Vouchers</h1>
          <p className={`text-xl text-neutral-600 transition-all duration-700 delay-100 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Exchange EXP for tokens, then use tokens to get NFT vouchers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12" ref={statsRef}>
          <Card className={`bg-gradient-to-br from-green-500 to-emerald-600 text-white transition-all duration-700 hover:scale-105 ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-green-100 text-sm">Total EXP</p>
                  <p className="text-3xl font-bold">{user?.totalExp || 0}</p>
                </div>
              </div>
              <p className="text-green-100 text-sm">
                Earn EXP by completing lessons
              </p>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br from-neutral-800 to-neutral-900 text-white transition-all duration-700 delay-100 hover:scale-105 ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-neutral-300 text-sm">Token Balance</p>
                  <p className="text-3xl font-bold">{user?.tokenBalance || 0}</p>
                </div>
              </div>
              <p className="text-neutral-300 text-sm">
                Exchange EXP to get tokens
              </p>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br from-green-600 to-green-700 text-white transition-all duration-700 delay-200 hover:scale-105 ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-green-100 text-sm">NFT Vouchers</p>
                  <p className="text-3xl font-bold">{user?.vouchers?.length || 0}</p>
                </div>
              </div>
              <p className="text-green-100 text-sm">
                Vouchers you already own
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12" ref={contentRef}>
          <Card className={`transition-all duration-700 hover:shadow-xl ${contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <CardHeader>
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-500" />
                Exchange EXP to Tokens
              </h2>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <Star className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">From EXP</p>
                      <input
                        type="number"
                        value={expToConvert}
                        onChange={(e) => setExpToConvert(Math.max(10, parseInt(e.target.value) || 0))}
                        className="text-2xl font-bold text-neutral-900 bg-transparent w-24 outline-none"
                        min={10}
                        step={10}
                      />
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-neutral-400" />
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm text-neutral-500 text-right">To Tokens</p>
                      <p className="text-2xl font-bold text-green-600">{tokenAmount}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <Coins className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-neutral-500 text-center">
                  Rate: {exchangeRate.expToToken} EXP = 1 Token
                </p>
              </div>

              {user && user.totalExp < expToConvert && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-xl mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">Not enough EXP. You have {user.totalExp} EXP.</span>
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleConvertExp}
                disabled={!user || user.totalExp < expToConvert || isConverting}
                isLoading={isConverting}
              >
                {isConverting ? 'Exchanging...' : 'Exchange Now'}
              </Button>
            </CardContent>
          </Card>

          <Card className={`transition-all duration-700 delay-200 hover:shadow-xl ${contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <CardHeader>
              <h2 className="text-xl font-bold text-neutral-900">Your Voucher History</h2>
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
                        <Gift className={`w-6 h-6 ${voucher.redeemed ? 'text-neutral-400' : 'text-green-600'}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-neutral-900">{voucher.name}</p>
                        <p className="text-sm text-neutral-500">
                          {voucher.redeemed ? 'Redeemed' : 'Active'}
                        </p>
                      </div>
                      {voucher.redeemed && <Check className="w-5 h-5 text-neutral-400" />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500">
                  <Gift className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                  <p>No vouchers yet. Exchange tokens to get vouchers!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className={`text-2xl font-bold text-neutral-900 mb-6 transition-all duration-700 ${contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>NFT Voucher Catalog</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vouchers.map((voucher) => {
              const canPurchase = user && user.tokenBalance >= voucher.tokenCost;
              const alreadyOwned = user?.vouchers?.some((v) => v.id === voucher.id);

              return (
                <Card key={voucher.id} hover className={`overflow-hidden transition-all duration-500 hover:scale-105 ${contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    <Gift className="w-16 h-16 text-green-400" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-neutral-900 mb-1">{voucher.name}</h3>
                    <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{voucher.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-green-600 font-bold">
                        <Coins className="w-4 h-4" />
                        <span>{voucher.tokenCost}</span>
                      </div>
                      {alreadyOwned ? (
                        <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          Owned
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant={canPurchase ? 'primary' : 'outline'}
                          disabled={!canPurchase || isPurchasing === voucher.id}
                          isLoading={isPurchasing === voucher.id}
                          onClick={() => handlePurchaseVoucher(voucher)}
                        >
                          {isPurchasing === voucher.id ? 'Buying...' : 'Buy'}
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
