'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Star, CheckCircle, Lock, Play } from 'lucide-react';
import { languages, lessons } from '@/lib/data';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LanguageDetailPage() {
  const params = useParams();
  const languageId = params.languageId as string;
  const { user } = useAppStore();

  const language = languages.find((l) => l.id === languageId);
  const languageLessons = lessons[languageId] || [];

  if (!language) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bahasa tidak ditemukan</h1>
          <Link href="/languages" className="text-emerald-600 hover:underline">
            Kembali ke daftar bahasa
          </Link>
        </div>
      </div>
    );
  }

  const completedLessons = languageLessons.filter(
    (lesson) => user?.progress[lesson.id]?.completed
  ).length;
  const progress = languageLessons.length > 0 ? (completedLessons / languageLessons.length) * 100 : 0;

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
              {language.flag}
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{language.name}</h1>
              <p className="text-emerald-100 text-lg mb-4">{language.region}</p>
              <p className="text-emerald-50 max-w-2xl mb-6">{language.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-200" />
                  <span>{language.totalLessons} Pelajaran</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-200" />
                  <span>~{language.totalLessons * 10} menit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-300" />
                  <span>+{language.totalExp} EXP Total</span>
                </div>
              </div>
            </div>
          </div>

          {user && (
            <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Progress Anda</span>
                <span className="text-emerald-200">
                  {completedLessons} / {languageLessons.length} Pelajaran
                </span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Daftar Pelajaran</h2>

        <div className="space-y-4">
          {languageLessons.map((lesson, index) => {
            const isCompleted = user?.progress[lesson.id]?.completed;
            const isLocked = index > 0 && !user?.progress[languageLessons[index - 1].id]?.completed && !isCompleted;

            return (
              <Link
                key={lesson.id}
                href={isLocked ? '#' : `/languages/${languageId}/lessons/${lesson.id}`}
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
                        lesson.order
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
