'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Wallet, 
  Send, 
  Download, 
  Copy, 
  ExternalLink, 
  RefreshCw,
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Award,
} from 'lucide-react';
import { useWallet } from '@/lib/hooks/useWallet';
import { useNFTs } from '@/lib/hooks/useNFTs';
import { useTokenExchange } from '@/lib/hooks/useTokenExchange';
import { useFaucet } from '@/lib/hooks/useFaucet';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { usePrivy } from '@privy-io/react-auth';

export default function WalletPage() {
  const router = useRouter();
  const { authenticated } = usePrivy();
  const { 
    address, 
    balanceFormatted,
    tokenBalanceFormatted, 
    isEmbedded, 
    loading: walletLoading,
    refreshWallet,
    getExplorerUrl,
  } = useWallet();
  const { nfts, loading: nftsLoading, refreshNFTs } = useNFTs();
  const { expStatus, exchanging, exchangeExpForTokens, refreshExpStatus } = useTokenExchange();
  const { faucetStatus, claiming: claimingFaucet, claimFaucet, refreshFaucetStatus } = useFaucet();

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'tokens' | 'nfts'>('tokens');
  const [exchangeSuccess, setExchangeSuccess] = useState<string | null>(null);
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const [faucetSuccess, setFaucetSuccess] = useState<string | null>(null);
  const [faucetError, setFaucetError] = useState<string | null>(null);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Wallet not available</h1>
          <p className="text-gray-600 mb-4">Please login first</p>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([refreshWallet(), refreshNFTs(), refreshExpStatus(), refreshFaucetStatus()]);
  };

  const handleExchangeExp = async () => {
    if (expStatus.availableExp <= 0) return;
    
    setExchangeError(null);
    setExchangeSuccess(null);

    const result = await exchangeExpForTokens(expStatus.availableExp);
    
    if (result.success) {
      setExchangeSuccess(result.explorerUrl || null);
    } else {
      setExchangeError(result.error || 'Exchange failed');
    }
  };

  const handleClaimFaucet = async () => {
    setFaucetError(null);
    setFaucetSuccess(null);

    const result = await claimFaucet();
    
    if (result.success) {
      setFaucetSuccess(result.explorerUrl || null);
      await refreshWallet(); // Refresh wallet balance
    } else {
      setFaucetError(result.error || 'Faucet claim failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 text-emerald-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
                <Wallet className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">My Wallet</h1>
                <p className="text-emerald-100">
                  {isEmbedded ? 'Embedded Wallet' : 'External Wallet'}
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={walletLoading || nftsLoading}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${(walletLoading || nftsLoading) ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Address Card */}
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <div className="p-6">
              <p className="text-emerald-100 text-sm mb-2">Wallet Address</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 text-white font-mono text-sm break-all">
                  {address || 'Loading...'}
                </code>
                <button
                  onClick={handleCopyAddress}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  title="Copy address"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {address && (
                  <a
                    href={getExplorerUrl(address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    title="View on explorer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              {copied && (
                <p className="text-emerald-200 text-xs mt-2">✓ Address copied!</p>
              )}
            </div>
          </Card>

          {/* Balance Card */}
          <Card className="bg-white/10 backdrop-blur border-white/20 mt-4">
            <div className="p-6">
              <p className="text-emerald-100 text-sm mb-2">Balance</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">
                  {balanceFormatted}
                </span>
                <span className="text-xl text-emerald-200">ETH</span>
              </div>
              <p className="text-emerald-200 text-xs mt-1">Lisk Sepolia Testnet</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'tokens'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Tokens
          </button>
          <button
            onClick={() => setActiveTab('nfts')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'nfts'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            NFTs ({nfts.length})
          </button>
        </div>

        {/* Tokens Tab */}
        {activeTab === 'tokens' && (
          <div className="space-y-6">
            {/* Faucet Card */}
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Download className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Free Token Faucet</h3>
                      <p className="text-sm text-gray-500">Claim {faucetStatus.faucetAmount} KASTURI tokens</p>
                    </div>
                  </div>
                </div>

                {faucetSuccess && (
                  <div className="mb-4 p-3 bg-emerald-100 border border-emerald-200 rounded-lg">
                    <p className="text-sm text-emerald-700">
                      ✓ Faucet claimed successfully!{' '}
                      <a href={faucetSuccess} target="_blank" rel="noopener noreferrer" className="underline">
                        View transaction
                      </a>
                    </p>
                  </div>
                )}

                {faucetError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{faucetError}</p>
                  </div>
                )}

                {!faucetStatus.canClaim && faucetStatus.timeUntilNext > 0 && (
                  <div className="mb-4 p-3 bg-amber-100 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-700">
                      ⏱️ Next claim available in {Math.ceil(faucetStatus.timeUntilNext / 3600)} hours
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleClaimFaucet}
                  disabled={claimingFaucet || !faucetStatus.canClaim}
                  className="w-full"
                >
                  {claimingFaucet ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Claiming...
                    </>
                  ) : faucetStatus.canClaim ? (
                    `Claim ${faucetStatus.faucetAmount} KASTURI`
                  ) : (
                    'Faucet on Cooldown'
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Free tokens every 24 hours
                </p>
              </div>
            </Card>

            {/* EXP Exchange Card */}
            <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <Award className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Exchange EXP → KASTURI</h3>
                      <p className="text-sm text-gray-500">Convert your learning EXP to tokens</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Total EXP</p>
                    <p className="text-xl font-bold text-gray-900">{expStatus.totalExp}</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Claimed</p>
                    <p className="text-xl font-bold text-gray-500">{expStatus.claimedExp}</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Available</p>
                    <p className="text-xl font-bold text-amber-600">{expStatus.availableExp}</p>
                  </div>
                </div>

                {exchangeSuccess && (
                  <div className="mb-4 p-3 bg-emerald-100 border border-emerald-200 rounded-lg">
                    <p className="text-sm text-emerald-700">
                      ✓ Exchange successful!{' '}
                      <a href={exchangeSuccess} target="_blank" rel="noopener noreferrer" className="underline">
                        View transaction
                      </a>
                    </p>
                  </div>
                )}

                {exchangeError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{exchangeError}</p>
                  </div>
                )}

                <Button
                  onClick={handleExchangeExp}
                  disabled={exchanging || expStatus.availableExp <= 0}
                  className="w-full"
                >
                  {exchanging ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Exchanging...
                    </>
                  ) : expStatus.availableExp > 0 ? (
                    `Exchange ${expStatus.availableExp} EXP → ${expStatus.availableExp} KASTURI`
                  ) : (
                    'No EXP available'
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Rate: 1 EXP = 1 KASTURI Token
                </p>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card hover className="cursor-not-allowed opacity-75">
                <div className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Send className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Send ETH</h3>
                    <p className="text-sm text-gray-500">Coming soon</p>
                  </div>
                </div>
              </Card>

              <Card hover className="cursor-not-allowed opacity-75">
                <div className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Download className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Receive ETH</h3>
                    <p className="text-sm text-gray-500">Use address above</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Token Holdings</h3>
                
                {/* KASTURI Token */}
                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-amber-600">K</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Kasturi Token</p>
                      <p className="text-sm text-gray-500">KSTR</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-amber-600">{tokenBalanceFormatted}</p>
                    <p className="text-sm text-gray-500">Lisk Sepolia</p>
                  </div>
                </div>

                {/* ETH */}
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-lg">Ξ</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Ethereum</p>
                      <p className="text-sm text-gray-500">ETH</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{balanceFormatted}</p>
                    <p className="text-sm text-gray-500">Lisk Sepolia</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* NFTs Tab */}
        {activeTab === 'nfts' && (
          <div>
            {nftsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              </div>
            ) : nfts.length === 0 ? (
              <Card>
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No NFTs yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Complete learning programs to earn Soulbound Tokens
                  </p>
                  <Button onClick={() => router.push('/languages')}>
                    Start Learning
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nfts.map((nft) => (
                  <Card key={nft.tokenId} hover>
                    <div className="p-4">
                      <div className="aspect-square rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 flex items-center justify-center relative overflow-hidden">
                        {nft.image && nft.image !== '/icon.webp' ? (
                          <img 
                            src={nft.image} 
                            alt={nft.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`text-center text-white p-4 ${nft.image && nft.image !== '/icon.webp' ? 'hidden' : ''}`}>
                          <Award className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-xs font-medium">SOULBOUND TOKEN</p>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {nft.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                        {nft.description}
                      </p>
                      {nft.issuedAt && (
                        <p className="text-xs text-gray-400 mb-3">
                          Issued: {new Date(nft.issuedAt).toLocaleDateString('id-ID')}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                          Soulbound
                        </span>
                        {nft.txHash && (
                          <a
                            href={`https://sepolia-blockscout.lisk.com/tx/${nft.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 text-xs"
                          >
                            View TX
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
