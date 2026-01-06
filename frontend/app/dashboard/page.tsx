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
import { languages, lessons } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function DashboardPage() {
  const { authenticated, login, user: privyUser } = usePrivy();
  const { user } = useAppStore();

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-neutral-600" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">Dashboard Belajar</h1>
          <p className="text-neutral-500 mb-8">
            Login untuk melihat progress belajar Anda.
          </p>
          <Button onClick={() => login()}>
            Login untuk Melanjutkan
          </Button>
        </div>
      </div>
    );
  }

  const totalCompletedLessons = Object.values(user?.progress || {}).filter(
    (p) => p.completed
  ).length;

  const totalLessons = Object.values(lessons).flat().length;
  const overallProgress = totalLessons > 0 ? (totalCompletedLessons / totalLessons) * 100 : 0;

  const recentActivity = Object.entries(user?.progress || {})
    .filter(([, p]) => p.completed && p.completedAt)
    .sort((a, b) => {
      const dateA = a[1].completedAt ? new Date(a[1].completedAt).getTime() : 0;
      const dateB = b[1].completedAt ? new Date(b[1].completedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  const languageProgress = languages.map((lang) => {
    const langLessons = lessons[lang.id] || [];
    const completed = langLessons.filter((l) => user?.progress[l.id]?.completed).length;
    return {
      ...lang,
      completed,
      total: langLessons.length,
      progress: langLessons.length > 0 ? (completed / langLessons.length) * 100 : 0,
    };
  });

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-1">
              Selamat datang, {user?.name || privyUser?.email?.address?.split('@')[0] || 'Learner'}!
            </h1>
            <p className="text-neutral-500">Pantau progress belajar Anda</p>
          </div>
          <Link href="/languages">
            <Button className="mt-4 md:mt-0">
              Lanjut Belajar
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 bg-neutral-50 rounded-2xl">
            <p className="text-xs text-neutral-500 mb-1">Total EXP</p>
            <p className="text-2xl font-bold text-neutral-900">{user?.totalExp || 0}</p>
          </div>
          <div className="p-5 bg-neutral-50 rounded-2xl">
            <p className="text-xs text-neutral-500 mb-1">Token</p>
            <p className="text-2xl font-bold text-neutral-900">{user?.tokenBalance || 0}</p>
          </div>
          <div className="p-5 bg-neutral-50 rounded-2xl">
            <p className="text-xs text-neutral-500 mb-1">Pelajaran</p>
            <p className="text-2xl font-bold text-neutral-900">{totalCompletedLessons}</p>
          </div>
          <div className="p-5 bg-neutral-50 rounded-2xl">
            <p className="text-xs text-neutral-500 mb-1">Sertifikat</p>
            <p className="text-2xl font-bold text-neutral-900">{user?.credentials?.length || 0}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-neutral-900">
                    Progress Bahasa
                  </h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {languageProgress.map((lang) => (
                    <Link key={lang.id} href={`/languages/${lang.id}`}>
                      <div className="group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{lang.flag}</span>
                            <div>
                              <p className="font-medium text-neutral-900 text-sm">
                                {lang.name}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {lang.completed} / {lang.total} pelajaran
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-neutral-900">
                            {Math.round(lang.progress)}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                            style={{ width: `${lang.progress}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="font-semibold text-neutral-900">
                  Aktivitas Terakhir
                </h2>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map(([lessonId, progress]) => {
                      const allLessons = Object.values(lessons).flat();
                      const lesson = allLessons.find((l) => l.id === lessonId);
                      if (!lesson) return null;

                      return (
                        <div key={lessonId} className="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-0">
                          <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-neutral-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-neutral-900 text-sm">{lesson.title}</p>
                            <p className="text-xs text-neutral-500">
                              +{progress.expEarned} EXP
                            </p>
                          </div>
                          <span className="text-xs text-neutral-400">
                            {progress.completedAt
                              ? new Date(progress.completedAt).toLocaleDateString('id-ID')
                              : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-neutral-500 text-sm">Belum ada aktivitas</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-neutral-900">
                  Pencapaian
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${totalCompletedLessons >= 1 ? 'bg-green-50' : 'bg-neutral-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${totalCompletedLessons >= 1 ? 'bg-green-500 text-white' : 'bg-neutral-200'}`}>
                        🎯
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 text-sm">Langkah Pertama</p>
                        <p className="text-xs text-neutral-500">Selesaikan 1 pelajaran</p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl ${totalCompletedLessons >= 5 ? 'bg-green-50' : 'bg-neutral-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${totalCompletedLessons >= 5 ? 'bg-green-500 text-white' : 'bg-neutral-200'}`}>
                        📚
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 text-sm">Pelajar Rajin</p>
                        <p className="text-xs text-neutral-500">Selesaikan 5 pelajaran</p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl ${(user?.credentials?.length || 0) >= 1 ? 'bg-green-50' : 'bg-neutral-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${(user?.credentials?.length || 0) >= 1 ? 'bg-green-500 text-white' : 'bg-neutral-200'}`}>
                        🏆
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 text-sm">Tersertifikasi</p>
                        <p className="text-xs text-neutral-500">Dapatkan sertifikat pertama</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-neutral-900 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-4">Progress Keseluruhan</h3>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-bold">{Math.round(overallProgress)}%</span>
                <span className="text-neutral-400 mb-1 text-sm">selesai</span>
              </div>
              <div className="h-2 bg-neutral-700 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <p className="text-neutral-400 text-sm">
                {totalCompletedLessons} dari {totalLessons} pelajaran
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
