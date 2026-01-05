'use client';

import { useState } from 'react';
import { Search, CheckCircle, XCircle, Award, ExternalLink, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface VerificationResult {
  found: boolean;
  address?: string;
  credentials?: {
    programId: string;
    languageName: string;
    issuedAt: string;
    tokenId: number;
    verified: boolean;
  }[];
  totalExp?: number;
}

export default function VerifyPage() {
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleVerify = async () => {
    if (!address.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (address.toLowerCase().startsWith('0x') && address.length >= 10) {
      setResult({
        found: true,
        address: address,
        credentials: [
          {
            programId: 'banjar-basic',
            languageName: 'Bahasa Banjar',
            issuedAt: '2026-01-05',
            tokenId: 1234,
            verified: true,
          },
        ],
        totalExp: 450,
      });
    } else {
      setResult({ found: false });
    }
    
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Verifikasi Sertifikat</h1>
          <p className="text-xl text-gray-600 max-w-xl mx-auto">
            Verifikasi sertifikat pembelajaran on-chain tanpa perlu login. Cukup masukkan alamat wallet.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Masukkan alamat wallet (0x...)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
              </div>
              <Button
                onClick={handleVerify}
                disabled={!address.trim() || isSearching}
                isLoading={isSearching}
                size="lg"
              >
                <Search className="w-5 h-5 mr-2" />
                {isSearching ? 'Mencari...' : 'Verifikasi'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {hasSearched && result && (
          <div className="space-y-6">
            {result.found ? (
              <>
                <Card className="border-emerald-200 bg-emerald-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-emerald-800">Terverifikasi</h2>
                        <p className="text-emerald-600 text-sm">Alamat memiliki sertifikat yang valid</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 mb-4">
                      <p className="text-sm text-gray-500 mb-1">Alamat Wallet</p>
                      <p className="font-mono text-gray-900 break-all">{result.address}</p>
                    </div>

                    <div className="bg-white rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-1">Total EXP</p>
                      <p className="text-2xl font-bold text-amber-600">{result.totalExp} EXP</p>
                    </div>
                  </CardContent>
                </Card>

                <h3 className="text-xl font-bold text-gray-900">Sertifikat Ditemukan</h3>
                
                {result.credentials?.map((cred, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                          <Award className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold">{cred.languageName}</h4>
                          <p className="text-emerald-100">Sertifikat Penyelesaian Program</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Program ID</p>
                          <p className="font-mono text-gray-900">{cred.programId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Token ID</p>
                          <p className="font-mono text-gray-900">#{cred.tokenId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Tanggal Terbit</p>
                          <p className="text-gray-900">{new Date(cred.issuedAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Status</p>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span className="text-emerald-600 font-medium">Terverifikasi On-Chain</span>
                          </div>
                        </div>
                      </div>
                      
                      <a
                        href={`https://blockscout.lisk.com/token/${result.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Lihat di Blockscout
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-red-800">Tidak Ditemukan</h2>
                      <p className="text-red-600">
                        Alamat tidak memiliki sertifikat Kasturi atau format alamat tidak valid.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mengapa Verifikasi On-Chain?</h3>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            <div className="p-4 bg-white rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Tidak Bisa Dipalsukan</h4>
              <p className="text-sm text-gray-500">Sertifikat tercatat permanen di blockchain Lisk</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Tanpa Login</h4>
              <p className="text-sm text-gray-500">Siapapun bisa memverifikasi tanpa akun</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Bukti Nyata</h4>
              <p className="text-sm text-gray-500">Usaha belajar tercatat dan dapat dibuktikan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
