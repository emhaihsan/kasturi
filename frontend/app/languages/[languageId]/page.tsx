'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Star, CheckCircle, Lock, Play, Award, ExternalLink, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { usePrograms } from '@/lib/hooks/usePrograms';
import { useCredential } from '@/lib/hooks/useCredential';
import { useWallet } from '@/lib/hooks/useWallet';

export default function LanguageDetailPage() {
  const params = useParams();
  const programId = params.languageId as string;
  const { user } = useAppStore();
  const { programs, loading } = usePrograms();
  const { claimCredential, claiming, checkCredential } = useCredential();
  const { getExplorerUrl } = useWallet();
  
  const [hasCredential, setHasCredential] = useState(false);
  const [credentialTxHash, setCredentialTxHash] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState(false);

  const program = programs.find((p) => p.id === programId);
  const programLessons = program?.lessons || [];

  const completedLessons = programLessons.filter(
    (lesson) => user?.progress[lesson.id]?.completed
  ).length;
  const progress = programLessons.length > 0 ? (completedLessons / programLessons.length) * 100 : 0;
  const isComplete = completedLessons === programLessons.length && programLessons.length > 0;

  // Check if user already has credential
  useEffect(() => {
    async function checkExistingCredential() {
      if (program?.programId && isComplete) {
        const has = await checkCredential(program.programId);
        setHasCredential(has);
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Program tidak ditemukan</h1>
          <Link href="/languages" className="text-emerald-600 hover:underline">
            Kembali ke daftar program
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/languages"
            className="inline-flex items-center gap-2 text-emerald-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>

          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur flex items-center justify-center text-5xl">
              🏝️
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{program.name}</h1>
              <p className="text-emerald-100 text-lg mb-4">Kalimantan Selatan</p>
              <p className="text-emerald-50 max-w-2xl mb-6">{program.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-200" />
                  <span>{programLessons.length} Pelajaran</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-200" />
                  <span>~{programLessons.length * 10} menit</span>
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
                <span className="font-medium">Progress Anda</span>
                <span className="text-emerald-200">
                  {completedLessons} / {programLessons.length} Pelajaran
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
                          <p className="font-semibold text-white">Sertifikat Diterbitkan! 🎉</p>
                          <p className="text-emerald-200 text-sm">Soulbound Token telah dicetak di wallet Anda</p>
                        </div>
                      </div>
                      {credentialTxHash && (
                        <a
                          href={getExplorerUrl(credentialTxHash, 'tx')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm transition-colors"
                        >
                          Lihat di Explorer
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
                          <p className="font-semibold text-white">Selamat! Program Selesai 🎉</p>
                          <p className="text-emerald-200 text-sm">Klaim sertifikat Soulbound Token Anda</p>
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
                              Cetak Sertifikat
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
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Daftar Pelajaran</h2>

        <div className="space-y-4">
          {programLessons.map((lesson, index) => {
            const isCompleted = user?.progress[lesson.id]?.completed;
            const isLocked = index > 0 && !user?.progress[programLessons[index - 1].id]?.completed && !isCompleted;

            return (
              <Link
                key={lesson.id}
                href={isLocked ? '#' : `/languages/${programId}/lessons/${lesson.id}`}
                className={isLocked ? 'cursor-not-allowed' : ''}
              >
                <Card
                  hover={!isLocked}
                  className={`${isLocked ? 'opacity-60' : ''} ${isCompleted ? 'border-emerald-200 bg-emerald-50/50' : ''}`}
                >
                  <div className="p-6 flex items-center gap-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isLocked
                          ? 'bg-gray-200 text-gray-400'
                          : 'bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-7 h-7" />
                      ) : isLocked ? (
                        <Lock className="w-6 h-6" />
                      ) : (
                        lesson.orderIndex
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {lesson.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-1">
                        {lesson.description}
                      </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>+{lesson.expReward} EXP</span>
                      </div>
                    </div>

                    {!isLocked && !isCompleted && (
                      <Button size="sm" className="hidden sm:flex">
                        <Play className="w-4 h-4 mr-1" />
                        Mulai
                      </Button>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
