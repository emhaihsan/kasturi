'use client';

import { useState, useEffect } from 'react';
import { Coins, Gift, Check, Loader2, ExternalLink } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { usePrivy } from '@privy-io/react-auth';
import { useInView } from '@/hooks/useInView';
import { useWallet } from '@/lib/hooks/useWallet';
import { useContracts } from '@/lib/hooks/use-contracts';

interface OnChainVoucher {
  id: string;
  name: string;
  price: string;
  isActive: boolean;
  userBalance: string;
}

export default function RewardsPage() {
  const { ref: heroRef, isInView: heroInView } = useInView();
  const { ref: statsRef, isInView: statsInView } = useInView();
  const { ref: contentRef, isInView: contentInView } = useInView();
  const { user, addVoucher } = useAppStore();
  const { authenticated, login } = usePrivy();
  const { address, tokenBalanceFormatted, refreshWallet } = useWallet();
  const { purchaseVoucher, redeemVoucher, loading: contractLoading } = useContracts();
  
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [onChainVouchers, setOnChainVouchers] = useState<OnChainVoucher[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(true);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Fetch on-chain vouchers
  useEffect(() => {
    async function fetchVouchers() {
      if (!address) {
        setLoadingVouchers(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/vouchers?walletAddress=${address}`);
        if (response.ok) {
          const data = await response.json();
          setOnChainVouchers(data.vouchers || []);
        }
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      } finally {
        setLoadingVouchers(false);
      }
    }
    
    fetchVouchers();
  }, [address, purchaseSuccess]);

  const handlePurchaseVoucher = async (voucher: OnChainVoucher) => {
    const tokenBalance = parseFloat(tokenBalanceFormatted) || 0;
    const voucherPrice = parseFloat(voucher.price) / 1e18; // Convert from wei
    
    if (tokenBalance < voucherPrice) {
      setPurchaseError('Saldo KASTURI tidak cukup');
      return;
    }
    
    setIsPurchasing(voucher.id);
    setPurchaseError(null);
    setPurchaseSuccess(null);
    setTxHash(null);
    
    try {
      const result = await purchaseVoucher(parseInt(voucher.id), 1);
      setTxHash(result.hash);
      setPurchaseSuccess(`Berhasil membeli voucher ${voucher.name}!`);
      await refreshWallet();
    } catch (error: any) {
      console.error('Purchase error:', error);
      setPurchaseError(error.message || 'Gagal membeli voucher');
    } finally {
      setIsPurchasing(null);
    }
  };

  const handleRedeemVoucher = async (voucher: OnChainVoucher) => {
    setIsRedeeming(voucher.id);
    setPurchaseError(null);
    setPurchaseSuccess(null);
    setTxHash(null);
    
    try {
      const result = await redeemVoucher(parseInt(voucher.id), 1);
      setTxHash(result.hash);
      setPurchaseSuccess(`Berhasil menukar voucher ${voucher.name}!`);
      await refreshWallet();
    } catch (error: any) {
      console.error('Redeem error:', error);
      setPurchaseError(error.message || 'Gagal menukar voucher');
    } finally {
      setIsRedeeming(null);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Gift className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">NFT Vouchers</h1>
          <p className="text-neutral-600 mb-8">
            Login untuk melihat dan membeli NFT voucher dengan token KASTURI.
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
          <h1 className={`text-4xl font-bold text-neutral-900 mb-4 transition-all duration-700 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>NFT Vouchers</h1>
          <p className={`text-xl text-neutral-600 transition-all duration-700 delay-100 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Tukar token KASTURI untuk mendapatkan NFT voucher eksklusif
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12" ref={statsRef}>
          <Card className={`bg-gradient-to-br from-amber-500 to-orange-600 text-white transition-all duration-700 hover:scale-105 ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-amber-100 text-sm">KASTURI Balance</p>
                  <p className="text-3xl font-bold">{tokenBalanceFormatted} KSTR</p>
                </div>
              </div>
              <p className="text-amber-100 text-sm">
                Token untuk membeli voucher NFT
              </p>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br from-green-600 to-emerald-700 text-white transition-all duration-700 delay-100 hover:scale-105 ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-green-100 text-sm">My Vouchers</p>
                  <p className="text-3xl font-bold">{user?.vouchers?.length || 0}</p>
                </div>
              </div>
              <p className="text-green-100 text-sm">
                Voucher NFT yang kamu miliki
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Success/Error Messages */}
        {purchaseSuccess && (
          <div className="mb-6 p-4 bg-emerald-100 border border-emerald-200 rounded-xl">
            <p className="text-emerald-700">{purchaseSuccess}</p>
          </div>
        )}
        {purchaseError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-xl">
            <p className="text-red-700">{purchaseError}</p>
          </div>
        )}

        <div className="mb-12" ref={contentRef}>
          <Card className={`transition-all duration-700 hover:shadow-xl ${contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <CardHeader>
              <h2 className="text-xl font-bold text-neutral-900">Voucher Kamu</h2>
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
                          {voucher.redeemed ? 'Sudah Ditukar' : 'Aktif'}
                        </p>
                      </div>
                      {voucher.redeemed ? (
                        <Check className="w-5 h-5 text-neutral-400" />
                      ) : (
                        <Button size="sm" variant="outline">Tukar</Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500">
                  <Gift className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                  <p>Belum ada voucher. Beli voucher dengan token KASTURI!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Transaction Success Link */}
        {txHash && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
            <p className="text-blue-700 text-sm">Transaksi berhasil!</p>
            <a
              href={`https://sepolia-blockscout.lisk.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Lihat di Blockscout
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        <div>
          <h2 className={`text-2xl font-bold text-neutral-900 mb-6 transition-all duration-700 ${contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Katalog Voucher NFT</h2>
          
          {loadingVouchers ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-4" />
              <p className="text-neutral-500">Loading vouchers...</p>
            </div>
          ) : onChainVouchers.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-500">Belum ada voucher tersedia di blockchain.</p>
              <p className="text-neutral-400 text-sm mt-2">Admin perlu membuat voucher type terlebih dahulu.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {onChainVouchers.map((voucher) => {
                const tokenBalance = parseFloat(tokenBalanceFormatted) || 0;
                const voucherPrice = parseFloat(voucher.price) / 1e18;
                const canPurchase = tokenBalance >= voucherPrice;
                const ownedCount = parseInt(voucher.userBalance) || 0;

                return (
                  <Card key={voucher.id} hover className={`overflow-hidden transition-all duration-500 hover:scale-105 ${contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                      <Gift className="w-16 h-16 text-amber-400" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-neutral-900 mb-1">{voucher.name}</h3>
                      <p className="text-sm text-neutral-500 mb-4">Voucher ID: #{voucher.id}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1 text-amber-600 font-bold">
                          <Coins className="w-4 h-4" />
                          <span>{voucherPrice.toFixed(0)} KSTR</span>
                        </div>
                        {ownedCount > 0 && (
                          <span className="text-sm text-emerald-600 font-medium">
                            Owned: {ownedCount}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={canPurchase ? 'primary' : 'outline'}
                          disabled={!canPurchase || isPurchasing === voucher.id}
                          onClick={() => handlePurchaseVoucher(voucher)}
                          className="flex-1"
                        >
                          {isPurchasing === voucher.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              Buying...
                            </>
                          ) : (
                            'Beli'
                          )}
                        </Button>
                        {ownedCount > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isRedeeming === voucher.id}
                            onClick={() => handleRedeemVoucher(voucher)}
                          >
                            {isRedeeming === voucher.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              'Tukar'
                            )}
                          </Button>
                        )}
                    </div>
                  </CardContent>
                </Card>
              );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
