'use client';

import { forwardRef } from 'react';
import { Award, Shield, ExternalLink } from 'lucide-react';

interface CertificateProps {
  programName: string;
  recipientName: string;
  recipientAddress: string;
  issuedAt: string;
  txHash: string;
  language?: string;
}

export const Certificate = forwardRef<HTMLDivElement, CertificateProps>(
  ({ programName, recipientName, recipientAddress, issuedAt, txHash, language }, ref) => {
    const formattedDate = new Date(issuedAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const shortAddress = `${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`;
    const shortTxHash = `${txHash.slice(0, 10)}...${txHash.slice(-8)}`;

    return (
      <div
        ref={ref}
        className="w-[800px] h-[566px] bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-8 relative overflow-hidden"
        style={{ fontFamily: 'system-ui, sans-serif' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute border border-white rounded-full"
                style={{
                  width: `${100 + i * 50}px`,
                  height: `${100 + i * 50}px`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Inner Border */}
        <div className="absolute inset-4 border-2 border-white/30 rounded-lg" />
        <div className="absolute inset-6 border border-white/20 rounded-lg" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-between text-white text-center p-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <img src="/icon.webp" alt="Kasturi" className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold tracking-wider">KASTURI</h1>
              <p className="text-xs text-emerald-200 tracking-widest">LEARN • EARN • PRESERVE</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            <div className="mb-4">
              <Award className="w-16 h-16 text-amber-300" />
            </div>
            
            <h2 className="text-lg text-emerald-200 mb-2">CERTIFICATE OF COMPLETION</h2>
            <h3 className="text-3xl font-bold mb-6">{programName}</h3>
            
            <p className="text-emerald-200 mb-2">This is to certify that</p>
            <p className="text-2xl font-semibold mb-1">{recipientName}</p>
            <p className="text-sm text-emerald-300 font-mono mb-4">{shortAddress}</p>
            
            <p className="text-emerald-200 text-sm">
              has successfully completed the {language || 'language'} learning program
            </p>
          </div>

          {/* Footer */}
          <div className="w-full">
            <div className="flex items-center justify-between text-xs text-emerald-200 mb-4">
              <div className="text-left">
                <p className="text-emerald-300">Issue Date</p>
                <p className="font-semibold text-white">{formattedDate}</p>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-emerald-300" />
                <div className="text-left">
                  <p className="text-emerald-300">Verified On-Chain</p>
                  <p className="font-mono text-white">{shortTxHash}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-3 flex items-center justify-between text-xs">
              <p className="text-emerald-300">Soulbound Token • Lisk Sepolia</p>
              <p className="text-emerald-300">sepolia-blockscout.lisk.com/tx/{txHash.slice(0, 10)}...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Certificate.displayName = 'Certificate';

export default Certificate;
