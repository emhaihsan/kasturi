'use client';

import { useState } from 'react';
import { useWallet } from '@/lib/hooks/useWallet';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Certificate from '@/components/Certificate';
import { Award, ExternalLink, Check, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
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
  const [result, setResult] = useState<MintResult | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [generatedPng, setGeneratedPng] = useState<string | null>(null);

  // Auto-fill wallet address
  const handleUseConnectedWallet = () => {
    if (address) {
      setWalletAddress(address);
    }
  };

  const handleGeneratePng = async () => {
    if (!walletAddress || !programName || !recipientName) {
      alert('Lengkapi semua field yang diperlukan');
      return;
    }

    try {
      // Generate SVG
      const { generateCertificateSVG } = await import('@/lib/certificate-generator');
      const svgString = generateCertificateSVG({
        programName,
        recipientName,
        recipientAddress: walletAddress,
        issuedAt: new Date().toISOString(),
        txHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        language,
      });

      // Convert to PNG via API
      const response = await fetch('/api/upload/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          svg: svgString,
          filename: `test-certificate-${Date.now()}.png`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PNG');
      }

      const data = await response.json();
      setGeneratedPng(data.httpUrl);
      alert('PNG generated! Check the download button below.');
    } catch (error) {
      alert('Failed to generate PNG: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleMint = async () => {
    if (!walletAddress || !programName || !recipientName) {
      setResult({ success: false, error: 'Lengkapi semua field yang diperlukan' });
      return;
    }

    setMinting(true);
    setResult(null);
    setGeneratedPng(null);

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
        // Set the generated PNG URL from the result
        if (data.credential?.imageUrl) {
          const httpUrl = data.credential.imageUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
          setGeneratedPng(httpUrl);
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Minting SBT</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Halaman khusus untuk testing minting Soulbound Token dengan metadata lengkap dan gambar sertifikat.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            Hanya untuk pengujian - tidak perlu menyelesaikan pelajaran
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Data Sertifikat</h2>
                
                <div className="space-y-5">
                  {/* Program Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Program
                    </label>
                    <input
                      type="text"
                      value={programName}
                      onChange={(e) => setProgramName(e.target.value)}
                      placeholder="Bahasa Banjar - Dasar"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    />
                  </div>

                  {/* Recipient Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Penerima
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Ahmad Banjar"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    />
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bahasa
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    >
                      <option value="Bahasa Banjar">Bahasa Banjar</option>
                      <option value="Bahasa Jawa">Bahasa Jawa</option>
                      <option value="Bahasa Sunda">Bahasa Sunda</option>
                      <option value="Bahasa Minang">Bahasa Minang</option>
                      <option value="Bahasa Bali">Bahasa Bali</option>
                    </select>
                  </div>

                  {/* Wallet Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wallet Address Penerima
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
                    <p className="mt-2 text-xs text-gray-500">
                      Alamat wallet yang akan menerima SBT
                    </p>
                  </div>

                  {/* Mint Button */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleGeneratePng}
                      disabled={!walletAddress || !programName || !recipientName}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <ImageIcon className="w-5 h-5 mr-2" />
                      Generate & Preview PNG
                    </Button>
                    
                    <Button
                      onClick={handleMint}
                      disabled={minting || !walletAddress || !programName || !recipientName}
                      className="w-full"
                    >
                      {minting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Minting...
                        </>
                      ) : (
                        <>
                          <Award className="w-5 h-5 mr-2" />
                          Mint SBT dengan Metadata
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Result */}
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
                          <h3 className="font-semibold text-emerald-800">Minting Berhasil!</h3>
                          <p className="text-sm text-emerald-600">SBT telah diterbitkan dengan metadata lengkap</p>
                        </div>
                      </div>

                      <div className="space-y-3 bg-white rounded-xl p-4">
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

                      <div className="flex flex-wrap gap-2 mt-4">
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
                          href={result.urls?.imagePreview}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium transition-colors"
                        >
                          <ImageIcon className="w-4 h-4" />
                          View Certificate Image
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
                      
                      {generatedPng && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm font-medium text-blue-800 mb-2">Generated PNG Certificate:</p>
                          <div className="flex gap-2">
                            <a
                              href={generatedPng}
                              download={`certificate-${Date.now()}.png`}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              <ImageIcon className="w-4 h-4" />
                              Download PNG
                            </a>
                            <a
                              href={generatedPng}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Open in New Tab
                            </a>
                          </div>
                          <img src={generatedPng} alt="Certificate Preview" className="mt-3 rounded-lg border border-blue-200 max-w-full" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-800">Minting Gagal</h3>
                        <p className="text-sm text-red-600">{result.error}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Preview Sertifikat</h2>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                {showPreview ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </div>

            {showPreview && (
              <div className="bg-gray-100 rounded-2xl p-4 overflow-auto">
                <div className="transform scale-[0.6] origin-top-left w-[800px]">
                  <Certificate
                    programName={programName || 'Nama Program'}
                    recipientName={recipientName || 'Nama Penerima'}
                    recipientAddress={walletAddress || '0x0000...0000'}
                    issuedAt={new Date().toISOString()}
                    txHash={'0x' + '0'.repeat(64)}
                    language={language}
                  />
                </div>
              </div>
            )}

            {/* Info */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Tentang Test Minting</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>Apa yang terjadi saat minting:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li>SBT di-mint ke wallet penerima (on-chain)</li>
                    <li>Gambar sertifikat di-generate sebagai SVG</li>
                    <li>Gambar di-upload ke IPFS via Pinata</li>
                    <li>Metadata NFT di-upload ke IPFS</li>
                    <li>Record disimpan di database</li>
                  </ol>
                  <p className="mt-4 text-amber-600">
                    ⚠️ SBT bersifat Soulbound - tidak dapat di-transfer setelah diterbitkan.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
