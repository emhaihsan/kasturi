'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Star, CheckCircle, Lock, Play, Award, Loader2, ExternalLink } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useCredential } from '@/lib/hooks/useCredential';
import { useWallet } from '@/lib/hooks/useWallet';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  expReward: number;
  orderIndex: number;
  thumbnailUrl?: string;
}

interface Module {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  level: string;
  totalExp: number;
  lessons: Lesson[];
  program: {
    id: string;
    programId: string;
    name: string;
    language: string;
  };
}

export default function ModuleDetailPage() {
  const params = useParams();
  const languageId = params.languageId as string;
  const moduleId = params.moduleId as string;
  const { user } = useAppStore();
  
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const { claimCredential, claiming, checkCredential } = useCredential();
  const { getExplorerUrl } = useWallet();
  const [hasCredential, setHasCredential] = useState(false);
  const [credentialTxHash, setCredentialTxHash] = useState<string | null>(null);
  const [mintError, setMintError] = useState<string | null>(null);
  const [mintSuccess, setMintSuccess] = useState(false);

  // Fetch module with lessons
  useEffect(() => {
    async function fetchModule() {
      try {
        const response = await fetch(`/api/modules/${moduleId}`);
        if (response.ok) {
          const data = await response.json();
          setModule(data.module);
        }
      } catch (error) {
        console.error('Error fetching module:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchModule();
  }, [moduleId]);

  const completedLessons = module?.lessons.filter(
    (lesson) => user?.progress[lesson.id]?.completed
  ).length || 0;
  const progress = module?.lessons.length ? (completedLessons / module.lessons.length) * 100 : 0;
  const isModuleComplete = !!module?.lessons.length && completedLessons === module.lessons.length;

  // Check if user has credential when module is complete
  useEffect(() => {
    if (isModuleComplete && module?.program?.programId) {
      checkCredential(module.program.programId).then((result) => {
        setHasCredential(result.hasCredential);
        if (result.txHash) {
          setCredentialTxHash(result.txHash);
        }
      });
    }
  }, [isModuleComplete, module?.program?.programId, checkCredential]);

  const handleMintCertificate = async () => {
    if (!module?.program?.programId) return;
    
    setMintError(null);
    setMintSuccess(false);
    
    const result = await claimCredential(module.program.programId);
    
    if (result.success && result.credential) {
      setMintSuccess(true);
      setHasCredential(true);
      setCredentialTxHash(result.credential.txHash);
    } else {
      setMintError(result.error || 'Failed to mint certificate');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-[var(--ink-muted)]">Loading...</div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <h1 className="text-2xl font-black text-neutral-900 mb-2 uppercase">Module not found</h1>
          <Link href={`/languages/${languageId}`} className="text-[var(--accent)] font-semibold">
            Back to module list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="bg-[var(--accent)] text-white py-16 border-b-4 border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/languages/${languageId}`}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {module.program.name}
          </Link>

          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-20 h-20 rounded-2xl bg-white neo-border neo-shadow-sm flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-neutral-900" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-white neo-pill text-neutral-900 text-sm capitalize">
                  {module.level}
                </span>
              </div>
              <h1 className="text-3xl font-black mb-2 uppercase">{module.name}</h1>
              <p className="text-white/80 max-w-2xl mb-6">{module.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-white" />
                  <span>{module.lessons.length} Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-white" />
                  <span>~{module.lessons.length * 8} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[var(--highlight)]" />
                  <span>+{module.totalExp} EXP</span>
                </div>
              </div>
            </div>
          </div>

          {user && (
            <div className="mt-8 bg-white rounded-2xl p-6 neo-border neo-shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-neutral-900">Module Progress</span>
                <span className="text-neutral-700 font-semibold">
                  {completedLessons} / {module.lessons.length} Lessons
                </span>
              </div>
              <div className="h-3 bg-[var(--surface)] rounded-full overflow-hidden neo-border">
                <div
                  className="h-full bg-[var(--highlight)] rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Mint Certificate Section */}
              {isModuleComplete && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  {hasCredential || mintSuccess ? (
                    <div className="bg-white rounded-xl p-4 neo-border neo-shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--highlight)] neo-border flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-neutral-900" />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">Certificate Minted!</p>
                          <p className="text-sm text-[var(--ink-muted)]">Your on-chain credential has been issued</p>
                        </div>
                      </div>
                      {credentialTxHash && (
                        <a
                          href={getExplorerUrl(credentialTxHash, 'tx')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[var(--accent)] text-white rounded-lg text-sm font-semibold neo-border"
                        >
                          View on Explorer
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white neo-border flex items-center justify-center flex-shrink-0">
                          <Award className="w-6 h-6 text-neutral-900" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-900 mb-1">Claim Your Certificate</h3>
                          <p className="text-sm text-[var(--ink-muted)]">
                            You've completed all lessons! Mint your Soulbound Token certificate on-chain.
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={handleMintCertificate}
                        disabled={claiming}
                        className="w-full"
                      >
                        {claiming ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            <span>Minting Certificate...</span>
                          </>
                        ) : (
                          <>
                            <Award className="w-5 h-5 mr-2" />
                            <span>Mint Certificate (Free)</span>
                          </>
                        )}
                      </Button>
                      {mintError && (
                        <div className="bg-white neo-border neo-shadow-sm rounded-lg p-3">
                          <p className="text-neutral-900 text-sm font-semibold">{mintError}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-black text-neutral-900 mb-8 uppercase">Lesson List</h2>

        <div className="space-y-4">
          {module.lessons.map((lesson, index) => {
            const isCompleted = user?.progress[lesson.id]?.completed;
            const prevLesson = index > 0 ? module.lessons[index - 1] : null;
            const isLocked = index > 0 && prevLesson && !user?.progress[prevLesson.id]?.completed && !isCompleted;

            return (
              <Link
                key={lesson.id}
                href={isLocked ? '#' : `/languages/${languageId}/${moduleId}/${lesson.id}`}
                className={isLocked ? 'cursor-not-allowed' : ''}
              >
                <Card
                  hover={!isLocked}
                  className={`${isLocked ? 'opacity-60' : ''} ${isCompleted ? 'bg-[var(--surface)]' : ''}`}
                >
                  <div className="p-6 flex items-center gap-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${
                        isCompleted
                          ? 'bg-[var(--highlight)] text-neutral-900 neo-border'
                          : isLocked
                          ? 'bg-[var(--surface)] text-neutral-400 neo-border'
                          : 'bg-white text-neutral-900 neo-border'
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
                      <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                        {lesson.title}
                      </h3>
                      <p className="text-[var(--ink-muted)] text-sm line-clamp-1">
                        {lesson.description}
                      </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-6 text-sm text-[var(--ink-muted)]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-900 font-semibold">
                        <Star className="w-4 h-4 text-[var(--highlight)]" />
                        <span>+{lesson.expReward} EXP</span>
                      </div>
                    </div>

                    {!isLocked && !isCompleted && (
                      <Button size="sm" className="hidden sm:flex">
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {module.lessons.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-[var(--ink-muted)]">No lessons available in this module yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
