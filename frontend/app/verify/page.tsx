'use client';

import { useState } from 'react';
import { Search, CheckCircle, XCircle, Award, ExternalLink, Shield, User, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useInView } from '@/hooks/useInView';
import Certificate from '@/components/Certificate';

interface Credential {
  id: string;
  programId: string;
  programName: string;
  language: string;
  issuedAt: string;
  txHash: string;
  recipientName: string;
}

interface VerificationResult {
  found: boolean;
  address?: string;
  displayName?: string;
  credentials?: Credential[];
  totalExp?: number;
}

export default function VerifyPage() {
  const { ref: heroRef, isInView: heroInView } = useInView();
  const { ref: infoRef, isInView: infoInView } = useInView();
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Credential | null>(null);

  const handleVerify = async () => {
    if (!address.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    setSelectedCert(null);
    
    try {
      // Fetch credentials from API
      const response = await fetch(`/api/credentials?walletAddress=${address}`);
      
      if (!response.ok) {
        setResult({ found: false });
        return;
      }

      const data = await response.json();
      
      if (data.credentials && data.credentials.length > 0) {
        setResult({
          found: true,
          address: address,
          displayName: data.user?.displayName,
          credentials: data.credentials.map((cred: any) => ({
            id: cred.id,
            programId: cred.programId,
            programName: cred.programName,
            language: cred.language || 'banjar',
            issuedAt: cred.issuedAt,
            txHash: cred.txHash,
            recipientName: data.user?.displayName || 'Anonymous Learner',
          })),
          totalExp: data.totalExp || 0,
        });
      } else {
        setResult({ found: false });
      }
    } catch (error) {
      console.error('Error verifying:', error);
      setResult({ found: false });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" ref={heroRef}>
          <div className={`w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 transition-all duration-700 ${heroInView ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            <Shield className="w-10 h-10 text-green-600" />
          </div>
          <h1 className={`text-4xl font-bold text-neutral-900 mb-4 transition-all duration-700 delay-100 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Verify Certificate</h1>
          <p className={`text-xl text-neutral-600 max-w-xl mx-auto transition-all duration-700 delay-200 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Verify on-chain learning certificates without logging in. Just enter the wallet address.
          </p>
        </div>

        <Card className={`mb-8 transition-all duration-700 delay-300 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Enter wallet address (0x...)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                />
              </div>
              <Button
                onClick={handleVerify}
                disabled={!address.trim() || isSearching}
                isLoading={isSearching}
                size="lg"
              >
                <Search className="w-5 h-5 mr-2" />
                {isSearching ? 'Searching...' : 'Verify'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {hasSearched && result && (
          <div className="space-y-6">
            {result.found ? (
              <>
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-green-800">Verified</h2>
                        <p className="text-green-600 text-sm">Address has valid certificates</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 mb-4">
                      <p className="text-sm text-neutral-500 mb-1">Wallet Address</p>
                      <p className="font-mono text-neutral-900 break-all">{result.address}</p>
                    </div>

                    <div className="bg-white rounded-xl p-4">
                      <p className="text-sm text-neutral-500 mb-1">Total EXP</p>
                      <p className="text-2xl font-bold text-green-600">{result.totalExp} EXP</p>
                    </div>
                  </CardContent>
                </Card>

                <h3 className="text-xl font-bold text-neutral-900">Certificates Found</h3>
                
                {result.credentials?.map((cred, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                            <Award className="w-8 h-8" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold">{cred.programName}</h4>
                            <p className="text-green-100">Program Completion Certificate</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedCert(cred)}
                          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                        >
                          View Certificate
                        </button>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Recipient</p>
                          <p className="font-medium text-gray-900">{cred.recipientName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">TX Hash</p>
                          <p className="font-mono text-gray-900 text-xs truncate">{cred.txHash}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500 mb-1">Issue Date</p>
                          <p className="text-neutral-900">{new Date(cred.issuedAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500 mb-1">Status</p>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-green-600 font-medium">Verified On-Chain</span>
                          </div>
                        </div>
                      </div>
                      
                      <a
                        href={`https://sepolia-blockscout.lisk.com/tx/${cred.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                      >
                        View on Blockscout
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
                      <h2 className="text-xl font-bold text-red-800">Not Found</h2>
                      <p className="text-red-600">
                        Address has no Kasturi certificates or address format is invalid.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="mt-16 text-center" ref={infoRef}>
          <h3 className={`text-lg font-semibold text-neutral-900 mb-4 transition-all duration-700 ${infoInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Why On-Chain Verification?</h3>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            <div className={`p-4 bg-white rounded-xl border border-neutral-100 hover:shadow-lg transition-all duration-500 delay-[100ms] ${infoInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-neutral-900 mb-1">Cannot Be Forged</h4>
              <p className="text-sm text-neutral-500">Certificates are permanently recorded on Lisk blockchain</p>
            </div>
            <div className={`p-4 bg-white rounded-xl border border-neutral-100 hover:shadow-lg transition-all duration-500 delay-[200ms] ${infoInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center mb-3">
                <User className="w-5 h-5 text-neutral-600" />
              </div>
              <h4 className="font-semibold text-neutral-900 mb-1">No Login Required</h4>
              <p className="text-sm text-neutral-500">Anyone can verify without an account</p>
            </div>
            <div className={`p-4 bg-white rounded-xl border border-neutral-100 hover:shadow-lg transition-all duration-500 delay-[300ms] ${infoInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center mb-3">
                <Award className="w-5 h-5 text-neutral-600" />
              </div>
              <h4 className="font-semibold text-neutral-900 mb-1">Real Proof</h4>
              <p className="text-sm text-neutral-500">Learning effort is recorded and provable</p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCert && result?.address && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Certificate Preview</h3>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex justify-center overflow-auto">
              <Certificate
                programName={selectedCert.programName}
                recipientName={selectedCert.recipientName}
                recipientAddress={result.address}
                issuedAt={selectedCert.issuedAt}
                txHash={selectedCert.txHash}
                language={selectedCert.language}
              />
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <a
                href={`https://sepolia-blockscout.lisk.com/tx/${selectedCert.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View on Blockscout
              </a>
              <button
                onClick={() => setSelectedCert(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
