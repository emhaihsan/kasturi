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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard Belajar</h1>
          <p className="text-gray-600 mb-8">
            Login untuk melihat progress belajar dan statistik Anda.
          </p>
          <Button size="lg" onClick={() => login()}>
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Selamat datang, {user?.name || privyUser?.email?.address?.split('@')[0] || 'Learner'}!
            </h1>
            <p className="text-gray-600">Pantau progress dan pencapaian belajar Anda</p>
          </div>
          <Link href="/languages">
            <Button className="mt-4 md:mt-0">
              Lanjut Belajar
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
                  <Star className="w-7 h-7 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total EXP</p>
                  <p className="text-2xl font-bold text-gray-900">{user?.totalExp || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <Coins className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Token</p>
                  <p className="text-2xl font-bold text-gray-900">{user?.tokenBalance || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pelajaran Selesai</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCompletedLessons}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
                  <Award className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sertifikat</p>
                  <p className="text-2xl font-bold text-gray-900">{user?.credentials?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600" />
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
                            <span className="text-2xl">{lang.flag}</span>
                            <div>
                              <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                {lang.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {lang.completed} / {lang.total} pelajaran
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-emerald-600">
                            {Math.round(lang.progress)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
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
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
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
                        <div key={lessonId} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{lesson.title}</p>
                            <p className="text-sm text-gray-500">
                              +{progress.expEarned} EXP
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {progress.completedAt
                              ? new Date(progress.completedAt).toLocaleDateString('id-ID')
                              : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Belum ada aktivitas. Mulai belajar sekarang!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Pencapaian
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border ${totalCompletedLessons >= 1 ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${totalCompletedLessons >= 1 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                        🎯
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Langkah Pertama</p>
                        <p className="text-sm text-gray-500">Selesaikan 1 pelajaran</p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border ${totalCompletedLessons >= 5 ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${totalCompletedLessons >= 5 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                        📚
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Pelajar Rajin</p>
                        <p className="text-sm text-gray-500">Selesaikan 5 pelajaran</p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border ${(user?.credentials?.length || 0) >= 1 ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${(user?.credentials?.length || 0) >= 1 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                        🏆
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Tersertifikasi</p>
                        <p className="text-sm text-gray-500">Dapatkan sertifikat pertama</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Progress Keseluruhan</h3>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-4xl font-bold">{Math.round(overallProgress)}%</span>
                  <span className="text-emerald-100 mb-1">selesai</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <p className="text-emerald-100 text-sm">
                  {totalCompletedLessons} dari {totalLessons} pelajaran
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
