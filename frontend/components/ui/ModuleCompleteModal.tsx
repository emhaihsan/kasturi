'use client';

import { useState, useEffect } from 'react';
import { Award, ExternalLink, Loader2, CheckCircle, X, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { useCredential } from '@/lib/hooks/useCredential';
import { useWallet } from '@/lib/hooks/useWallet';

interface ModuleCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName: string;
  programId: string;
  programName: string;
  expEarned: number;
  onCredentialClaimed?: (txHash: string) => void;
}

export function ModuleCompleteModal({
  isOpen,
  onClose,
  moduleName,
  programId,
  programName,
  expEarned,
  onCredentialClaimed,
}: ModuleCompleteModalProps) {
  const { claimCredential, claiming, checkCredential } = useCredential();
  const { getExplorerUrl } = useWallet();
  
  const [hasCredential, setHasCredential] = useState(false);
  const [credentialTxHash, setCredentialTxHash] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && programId) {
      checkCredential(programId).then((result) => {
        setHasCredential(result.hasCredential);
        if (result.txHash) {
          setCredentialTxHash(result.txHash);
        }
      });
    }
  }, [isOpen, programId, checkCredential]);

  const handleClaimCredential = async () => {
    if (!programId) return;
    
    setClaimError(null);
    setClaimSuccess(false);
    
    const result = await claimCredential(programId);
    
    if (result.success && result.credential) {
      setClaimSuccess(true);
      setHasCredential(true);
      setCredentialTxHash(result.credential.txHash);
      onCredentialClaimed?.(result.credential.txHash);
    } else {
      setClaimError(result.error || 'Failed to claim credential');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-emerald-500 to-teal-600" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative pt-8 pb-8 px-6">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-amber-600 font-semibold">Module Completed!</span>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Congratulations! 🎉
            </h2>
            <p className="text-gray-600">
              You have completed <span className="font-semibold text-emerald-600">{moduleName}</span>
            </p>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <p className="text-sm text-amber-700">Experience Earned</p>
                <p className="text-2xl font-bold text-amber-600">+{expEarned} EXP</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4 text-center">
              Claim Your Certificate
            </h3>

            {hasCredential || claimSuccess ? (
              <div className="bg-emerald-50 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-800">Certificate Minted!</p>
                    <p className="text-sm text-emerald-600">Soulbound Token issued to your wallet</p>
                  </div>
                </div>
                {credentialTxHash && (
                  <a
                    href={getExplorerUrl(credentialTxHash, 'tx')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    View on Explorer
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 text-center">
                  Mint a Soulbound Token certificate for completing {programName}
                </p>
                <Button
                  onClick={handleClaimCredential}
                  disabled={claiming}
                  className="w-full"
                >
                  {claiming ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Minting Certificate...
                    </>
                  ) : (
                    <>
                      <Award className="w-5 h-5 mr-2" />
                      Mint Certificate (Free)
                    </>
                  )}
                </Button>
                {claimError && (
                  <p className="text-red-500 text-sm text-center">{claimError}</p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 py-2.5 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
}
