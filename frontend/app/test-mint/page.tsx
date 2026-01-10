'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/lib/hooks/useWallet';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Award, ExternalLink, Check, AlertCircle, Loader2, Image as ImageIcon, Download } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';

interface MintResult {
  success: boolean;
  credential?: {
    id: string;
    programId: string;
    programName: string;
    recipientName: string;
    txHash: string;
    metadataUrl: string;
    imageUrl: string;
  };
  urls?: {
    blockscout: string;
    imagePreview: string;
    metadataPreview: string;
  };
  error?: string;
}

export default function TestMintPage() {
  const { authenticated } = usePrivy();
  const { address } = useWallet();
  
  const [programName, setProgramName] = useState('Bahasa Banjar - Dasar');
  const [recipientName, setRecipientName] = useState('');
  const [language, setLanguage] = useState('Bahasa Banjar');
  const [walletAddress, setWalletAddress] = useState('');
  
  const [minting, setMinting] = useState(false);
  const [generatingPng, setGeneratingPng] = useState(false);
  const [result, setResult] = useState<MintResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleUseConnectedWallet = () => {
    if (address) {
      setWalletAddress(address);
    }
  };

  // Generate local preview without IPFS upload
  const handleGeneratePreview = async () => {
    if (!walletAddress || !programName || !recipientName) {
      alert('Please fill in all required fields');
      return;
    }

    setGeneratingPng(true);
    setResult(null);
    try {
      const response = await fetch('/api/certificate/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programName,
          recipientName,
          recipientAddress: walletAddress,
          issuedAt: new Date().toISOString(),
          txHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const blob = await response.blob();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const objectUrl = URL.createObjectURL(blob);
      setPreviewUrl(objectUrl);
      setIpfsUrl(null);
    } catch (error) {
      alert('❌ Failed to generate preview: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setGeneratingPng(false);
    }
  };

  const handleMint = async () => {
    if (!walletAddress || !programName || !recipientName) {
      setResult({ success: false, error: 'Please fill in all required fields' });
      return;
    }

    setMinting(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          programName,
          recipientName,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({ success: false, error: data.error || 'Minting failed' });
      } else {
        setResult({ success: true, ...data });
        // Fetch the minted certificate image
        if (data.urls?.imagePreview) {
          try {
            const imgRes = await fetch(data.urls.imagePreview);
            if (imgRes.ok) {
              const blob = await imgRes.blob();
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              setPreviewUrl(URL.createObjectURL(blob));
              setIpfsUrl(data.urls.imagePreview);
            }
          } catch (e) {
            console.error('Failed to fetch minted image:', e);
          }
        }
      }
    } catch (error) {
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      });
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Minting SBT</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Test end-to-end flow: Generate PNG → Upload IPFS → Mint SBT → Set Metadata
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            Testing only - no lesson completion required
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Certificate Data</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Name
                </label>
                <input
                  type="text"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  placeholder="Bahasa Banjar - Dasar"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Ahmad Banjar"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                >
                  <option value="Bahasa Banjar">Bahasa Banjar</option>
                  <option value="Bahasa Jawa">Bahasa Jawa</option>
                  <option value="Bahasa Sunda">Bahasa Sunda</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Wallet Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="0x..."
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all font-mono text-sm"
                  />
                  {authenticated && address && (
                    <Button
                      variant="outline"
                      onClick={handleUseConnectedWallet}
                      className="whitespace-nowrap"
                    >
                      Use Mine
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleGeneratePreview}
                  disabled={generatingPng || !walletAddress || !programName || !recipientName}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {generatingPng ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating PNG...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-5 h-5 mr-2" />
                      1. Generate & Preview PNG (Local)
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleMint}
                  disabled={minting || !walletAddress || !programName || !recipientName}
                  className="w-full"
                >
                  {minting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Minting SBT...
                    </>
                  ) : (
                    <>
                      <Award className="w-5 h-5 mr-2" />
                      2. Mint SBT (Full Flow)
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {previewUrl && !result && (
          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">PNG Generated!</h3>
                  <p className="text-sm text-blue-600">Certificate preview generated successfully</p>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <a
                  href={previewUrl}
                  download="certificate-preview.png"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PNG
                </a>
              </div>

              <img src={previewUrl} alt="Certificate Preview" className="rounded-lg border border-blue-200 max-w-full" />
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className={`mt-6 ${result.success ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
            <CardContent className="p-6">
              {result.success ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-emerald-800">Minting Successful!</h3>
                      <p className="text-sm text-emerald-600">SBT has been issued with complete metadata</p>
                    </div>
                  </div>

                  <div className="space-y-3 bg-white rounded-xl p-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Transaction Hash</p>
                      <p className="font-mono text-sm text-gray-800 break-all">{result.credential?.txHash}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Metadata URL (IPFS)</p>
                      <p className="font-mono text-xs text-gray-800 break-all">{result.credential?.metadataUrl}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Image URL (IPFS)</p>
                      <p className="font-mono text-xs text-gray-800 break-all">{result.credential?.imageUrl}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <a
                      href={result.urls?.blockscout}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Blockscout
                    </a>
                    <a
                      href={result.urls?.metadataPreview}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      View Metadata JSON
                    </a>
                  </div>

                  {previewUrl && (
                    <div className="p-4 bg-white border border-emerald-200 rounded-lg">
                      <p className="text-sm font-medium text-emerald-800 mb-2">Certificate PNG:</p>
                      <div className="flex gap-2 mb-3">
                        <a
                          href={previewUrl}
                          download="certificate.png"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download PNG
                        </a>
                        {ipfsUrl && (
                          <a
                            href={ipfsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View on IPFS
                          </a>
                        )}
                      </div>
                      <img src={previewUrl} alt="Certificate" className="rounded-lg border border-emerald-200 max-w-full" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800">Minting Failed</h3>
                    <p className="text-sm text-red-600">{result.error}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Minting Test Flow</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong>Button 1: Generate & Preview PNG (Local)</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Generate certificate PNG using @vercel/og</li>
                <li>Preview directly without uploading to IPFS</li>
                <li>Download PNG to your computer</li>
              </ol>
              
              <p className="pt-3"><strong>Button 2: Mint SBT (Full Flow)</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Mint SBT on-chain to recipient wallet</li>
                <li>Generate & upload certificate PNG to IPFS</li>
                <li>Upload metadata JSON to IPFS</li>
                <li>Set tokenURI on-chain</li>
                <li>Save record to database</li>
              </ol>
              
              <p className="mt-4 text-amber-600">
                ⚠️ SBT is Soulbound - it cannot be transferred after issuance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
