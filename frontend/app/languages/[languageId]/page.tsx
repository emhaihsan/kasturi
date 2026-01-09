'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Star, CheckCircle, Play, Award, ExternalLink, Loader2, FolderOpen, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { useCredential } from '@/lib/hooks/useCredential';
import { useWallet } from '@/lib/hooks/useWallet';

interface Module {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  level: string;
  totalExp: number;
  orderIndex: number;
  lessonCount: number;
  completedLessons?: number;
}

interface Program {
  id: string;
  programId: string;
  name: string;
  description: string;
  language: string;
  totalExp: number;
  modules: Module[];
}

export default function LanguageDetailPage() {
  const params = useParams();
  const languageId = params.languageId as string;
  const { user } = useAppStore();
  const { claimCredential, claiming, checkCredential } = useCredential();
  const { getExplorerUrl } = useWallet();
  
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCredential, setHasCredential] = useState(false);
  const [credentialTxHash, setCredentialTxHash] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Fetch program with modules
  useEffect(() => {
    async function fetchProgram() {
      try {
        const response = await fetch(`/api/programs/${languageId}`);
        if (response.ok) {
          const data = await response.json();
          setProgram(data.program);
        }
      } catch (error) {
        console.error('Error fetching program:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProgram();
  }, [languageId]);

  // Calculate total progress across all modules
  const totalLessons = program?.modules.reduce((sum, m) => sum + m.lessonCount, 0) || 0;
  const completedLessons = program?.modules.reduce((sum, m) => sum + (m.completedLessons || 0), 0) || 0;
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const isComplete = completedLessons === totalLessons && totalLessons > 0;

  // Check if user already has credential
  useEffect(() => {
    async function checkExistingCredential() {
      if (program?.programId && isComplete) {
        const result = await checkCredential(program.programId);
        setHasCredential(result.hasCredential);
        if (result.txHash) {
          setCredentialTxHash(result.txHash);
        }
      }
    }
    checkExistingCredential();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program?.programId, isComplete]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Language not found</h1>
          <Link href="/languages" className="text-emerald-600 hover:underline">
            Back to language list
          </Link>
        </div>
      </div>
    );
  }

  // Handle claim credential
  const handleClaimCredential = async () => {
    if (!program?.programId) return;
    
    setClaimError(null);
    setClaimSuccess(false);
    
    const result = await claimCredential(program.programId);
    
    if (result.success && result.credential) {
      setClaimSuccess(true);
      setHasCredential(true);
      setCredentialTxHash(result.credential.txHash);
    } else {
      setClaimError(result.error || 'Failed to claim credential');
    }
  };

  const languageFlags: Record<string, string> = {
    banjar: '🏝️',
    jawa: '🏛️',
    sunda: '🌄',
    minang: '🏔️',
    bali: '🌺',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/languages"
            className="inline-flex items-center gap-2 text-emerald-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Language List
          </Link>

          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur flex items-center justify-center text-5xl">
              {languageFlags[program.language] || '📚'}
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{program.name}</h1>
              <p className="text-emerald-50 max-w-2xl mb-6">{program.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-emerald-200" />
                  <span>{program.modules.length} Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-200" />
                  <span>{totalLessons} Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-300" />
                  <span>+{program.totalExp} EXP Total</span>
                </div>
              </div>
            </div>
          </div>

          {user && (
            <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Your Progress</span>
                <span className="text-emerald-200">
                  {completedLessons} / {totalLessons} Lessons
                </span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Credential Claim Section */}
              {isComplete && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  {hasCredential || claimSuccess ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">Certificate Issued! 🎉</p>
                          <p className="text-emerald-200 text-sm">Soulbound Token has been minted to your wallet</p>
                        </div>
                      </div>
                      {credentialTxHash && (
                        <a
                          href={getExplorerUrl(credentialTxHash, 'tx')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm transition-colors"
                        >
                          View on Explorer
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-amber-400/20 flex items-center justify-center">
                          <Award className="w-6 h-6 text-amber-300" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">Congratulations! All Modules Completed 🎉</p>
                          <p className="text-emerald-200 text-sm">Claim your Soulbound Token certificate</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={handleClaimCredential}
                          disabled={claiming}
                          className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-500 disabled:bg-amber-400/50 text-neutral-900 font-semibold rounded-full transition-colors"
                        >
                          {claiming ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Minting...
                            </>
                          ) : (
                            <>
                              <Award className="w-4 h-4" />
                              Mint Certificate
                            </>
                          )}
                        </button>
                        {claimError && (
                          <p className="text-red-300 text-xs">{claimError}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Choose a Learning Module</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {program.modules.map((module) => {
            const moduleProgress = module.lessonCount > 0 
              ? ((module.completedLessons || 0) / module.lessonCount) * 100 
              : 0;
            const isModuleComplete = (module.completedLessons || 0) === module.lessonCount && module.lessonCount > 0;

            return (
              <Link key={module.id} href={`/languages/${languageId}/${module.moduleId}`}>
                <Card hover className={`h-full ${isModuleComplete ? 'border-emerald-200 bg-emerald-50/50' : ''}`}>
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        isModuleComplete ? 'bg-emerald-500' : 'bg-emerald-100'
                      }`}>
                        {isModuleComplete ? (
                          <CheckCircle className="w-7 h-7 text-white" />
                        ) : (
                          <FolderOpen className={`w-7 h-7 ${isModuleComplete ? 'text-white' : 'text-emerald-600'}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{module.name}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{module.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span>{module.lessonCount} Lessons</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span>+{module.totalExp} EXP</span>
                      </div>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs capitalize">
                        {module.level}
                      </span>
                    </div>

                    {user && (module.completedLessons || 0) > 0 && (
                      <div className="text-sm text-emerald-600 font-medium">
                        {module.completedLessons} / {module.lessonCount} lessons completed
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {program.modules.length === 0 && (
          <div className="text-center py-16">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No modules available for this language yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
