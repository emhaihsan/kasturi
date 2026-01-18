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
      
      <div className="relative bg-white rounded-3xl neo-border neo-shadow max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="absolute top-0 left-0 right-0 h-32 bg-[var(--accent)] border-b-4 border-neutral-900" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white text-neutral-900 neo-border transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative pt-8 pb-8 px-6">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-white neo-border neo-shadow-sm flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[var(--highlight)] neo-border flex items-center justify-center">
                <Award className="w-10 h-10 text-neutral-900" />
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-neutral-900" />
              <span className="text-neutral-900 font-semibold">Module Completed!</span>
              <Sparkles className="w-5 h-5 text-neutral-900" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 mb-2 uppercase">
              Congratulations! 🎉
            </h2>
            <p className="text-[var(--ink-muted)]">
              You have completed <span className="font-semibold text-neutral-900">{moduleName}</span>
            </p>
          </div>

          <div className="bg-[var(--surface)] rounded-2xl p-4 mb-6 neo-border">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white neo-border flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <p className="text-sm text-[var(--ink-muted)]">Experience Earned</p>
                <p className="text-2xl font-black text-neutral-900">+{expEarned} EXP</p>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-900/10 pt-6">
            <h3 className="text-sm font-semibold text-[var(--ink-muted)] mb-4 text-center">
              Claim Your Certificate
            </h3>

            {hasCredential || claimSuccess ? (
              <div className="bg-white rounded-2xl p-4 neo-border neo-shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--highlight)] neo-border flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-neutral-900" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">Certificate Minted!</p>
                    <p className="text-sm text-[var(--ink-muted)]">Soulbound Token issued to your wallet</p>
                  </div>
                </div>
                {credentialTxHash && (
                  <a
                    href={getExplorerUrl(credentialTxHash, 'tx')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-[var(--accent)] text-white rounded-xl text-sm font-semibold neo-border"
                  >
                    View on Explorer
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-[var(--ink-muted)] text-center">
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
                  <p className="text-neutral-900 text-sm text-center font-semibold">{claimError}</p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 py-2.5 text-neutral-900 text-sm font-semibold transition-colors"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
}
