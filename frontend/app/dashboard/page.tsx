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
      <div className="min-h-screen bg-white pt-32 pb-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-neutral-600" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">Learning Dashboard</h1>
          <p className="text-neutral-500 mb-8">
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
    const completed = program.lessons.filter((l) => user?.progress[l.id]?.completed).length;
    return {
      id: program.id,
      name: program.name,
      flag: '🏝️',
      completed,
      total: program.lessons.length,
      progress: program.lessons.length > 0 ? (completed / program.lessons.length) * 100 : 0,
      comingSoon: false,
    };
  });

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-1">
              Welcome, {user?.name || privyUser?.email?.address?.split('@')[0] || 'Learner'}!
            </h1>
            <p className="text-neutral-500">Track your learning progress</p>
          </div>
          <div>
            <Link href="/languages">
              <Button className="mt-4 md:mt-0">
                Continue Learning
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 bg-neutral-50 rounded-2xl hover:shadow-lg transition-shadow">
            <p className="text-xs text-neutral-500 mb-1">Total EXP</p>
            <p className="text-2xl font-bold text-neutral-900">{user?.totalExp || 0}</p>
          </div>
          <div className="p-5 bg-neutral-50 rounded-2xl hover:shadow-lg transition-shadow">
            <p className="text-xs text-neutral-500 mb-1">Tokens</p>
            <p className="text-2xl font-bold text-neutral-900">{user?.tokenBalance || 0}</p>
          </div>
          <div className="p-5 bg-neutral-50 rounded-2xl hover:shadow-lg transition-shadow">
            <p className="text-xs text-neutral-500 mb-1">Lessons</p>
            <p className="text-2xl font-bold text-neutral-900">{totalCompletedLessons}</p>
          </div>
          <div className="p-5 bg-neutral-50 rounded-2xl hover:shadow-lg transition-shadow">
            <p className="text-xs text-neutral-500 mb-1">Certificates</p>
            <p className="text-2xl font-bold text-neutral-900">{user?.credentials?.length || 0}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-neutral-900">
                    Language Progress
                  </h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {programsLoading ? (
                    <div className="text-center py-8 text-neutral-500">Loading...</div>
                  ) : (
                    languageProgress.map((lang) => {
                      const isComingSoon = lang.comingSoon;
                      return (
                      <Link key={lang.id} href={isComingSoon ? '#' : `/languages/${lang.id}`} className={isComingSoon ? 'cursor-not-allowed' : ''}>
                        <div className={`group ${isComingSoon ? 'opacity-60' : ''}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{lang.flag}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-neutral-900 text-sm">
                                  {lang.name}
                                </p>
                                {isComingSoon && (
                                  <span className="px-2 py-0.5 bg-neutral-200 text-neutral-600 text-xs rounded-full">
                                    Coming Soon
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-neutral-500">
                                {isComingSoon ? 'Available soon' : `${lang.completed} / ${lang.total} lessons`}
                              </p>
                            </div>
                          </div>
                          {!isComingSoon && (
                            <span className="text-sm font-medium text-neutral-900">
                              {Math.round(lang.progress)}%
                            </span>
                          )}
                        </div>
                        {!isComingSoon && (
                          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full transition-all duration-500"
                              style={{ width: `${lang.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                      </Link>
                      );
                    })
                  )}
                </div>
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
