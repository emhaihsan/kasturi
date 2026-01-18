'use client';

import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import {
  Star,
  Coins,
  Award,
  BookOpen,
  ChevronRight,
  Trophy,
  Target,
  Clock,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { usePrograms } from '@/lib/hooks/usePrograms';

export default function DashboardPage() {
  const { authenticated, login, user: privyUser } = usePrivy();
  const { user } = useAppStore();
  const { programs, loading: programsLoading } = usePrograms();

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[var(--background)] pt-32 pb-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white neo-border neo-shadow-sm flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-neutral-900" />
          </div>
          <h1 className="text-2xl font-black text-neutral-900 mb-3 uppercase">Learning Dashboard</h1>
          <p className="text-[var(--ink-muted)] mb-8">
            Login to view your learning progress.
          </p>
          <Button onClick={() => login()}>
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  const totalCompletedLessons = Object.values(user?.progress || {}).filter(
    (p) => p.completed
  ).length;

  const languageProgress = programs.map((program) => {
    return {
      id: program.programId, // Use programId for routing
      name: program.name,
      flag: '🏝️',
      completed: 0,
      total: program.lessonCount || 0,
      progress: 0,
      comingSoon: program.isActive === false,
    };
  });

  return (
    <div className="min-h-screen bg-[var(--background)] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-neutral-900 mb-1 uppercase">
              Welcome, {user?.name && !user.name.startsWith('0x') ? user.name : (privyUser?.email?.address?.split('@')[0] || 'Learner')}!
            </h1>
            <p className="text-[var(--ink-muted)]">Track your learning progress</p>
          </div>
          <div>
            <Link href="/languages">
              <Button className="mt-4 md:mt-0">
                Continue Learning
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="p-5 bg-white rounded-2xl neo-border neo-shadow-sm">
            <p className="text-xs text-[var(--ink-muted)] mb-1">Total EXP</p>
            <p className="text-2xl font-bold text-neutral-900">{user?.totalExp || 0}</p>
          </div>
          <div className="p-5 bg-white rounded-2xl neo-border neo-shadow-sm">
            <p className="text-xs text-[var(--ink-muted)] mb-1">Lessons</p>
            <p className="text-2xl font-bold text-neutral-900">{totalCompletedLessons}</p>
          </div>
          <div className="p-5 bg-white rounded-2xl neo-border neo-shadow-sm">
            <p className="text-xs text-[var(--ink-muted)] mb-1">Certificates</p>
            <p className="text-2xl font-bold text-neutral-900">{user?.credentials?.length || 0}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Show "Start Learning" CTA if user has no progress */}
          {totalCompletedLessons === 0 ? (
            <Card className="hover:-translate-y-1 transition-all">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white neo-border neo-shadow-sm flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-neutral-900" />
                  </div>
                  <h2 className="text-xl font-black text-neutral-900 mb-2 uppercase">
                    Start Your Learning Journey!
                  </h2>
                  <p className="text-[var(--ink-muted)] mb-6 max-w-md mx-auto">
                    You haven't started any lessons yet. Choose a regional language you want to learn and begin your cultural adventure now!
                  </p>
                  <Link href="/languages">
                    <Button size="lg" className="px-8">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Start Learning Now
                    </Button>
                  </Link>
                  
                  {/* Available languages preview */}
                  {!programsLoading && languageProgress.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-neutral-900/20">
                      <p className="text-sm text-[var(--ink-muted)] mb-4">Available languages:</p>
                      <div className="flex flex-wrap justify-center gap-3">
                        {languageProgress.filter(l => !l.comingSoon).map((lang) => (
                          <Link 
                            key={lang.id} 
                            href={`/languages/${lang.id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-white neo-pill transition-transform hover:-translate-y-0.5"
                          >
                            <span>{lang.flag}</span>
                            <span className="text-sm font-medium text-neutral-700">{lang.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Show progress if user has started learning */
            <Card className="hover:-translate-y-1 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-neutral-900">
                    Learning Progress
                  </h2>
                  <Link href="/languages" className="text-sm font-semibold text-[var(--accent)]">
                    View All →
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {programsLoading ? (
                    <div className="text-center py-8 text-neutral-500">Loading...</div>
                  ) : languageProgress.filter(l => !l.comingSoon).length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-neutral-500">No languages available yet</p>
                    </div>
                  ) : (
                    languageProgress.filter(l => !l.comingSoon).map((lang) => (
                      <Link key={lang.id} href={`/languages/${lang.id}`}>
                        <div className="group p-4 rounded-xl hover:bg-[var(--surface)] transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{lang.flag}</span>
                              <div>
                                <p className="font-medium text-neutral-900">
                                  {lang.name}
                                </p>
                                <p className="text-sm text-[var(--ink-muted)]">
                                  {lang.total} lessons available
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[var(--accent)] transition-colors" />
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
