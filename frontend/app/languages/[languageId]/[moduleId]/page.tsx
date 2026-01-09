'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Star, CheckCircle, Lock, Play } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Modul tidak ditemukan</h1>
          <Link href={`/languages/${languageId}`} className="text-emerald-600 hover:underline">
            Kembali ke daftar modul
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/languages/${languageId}`}
            className="inline-flex items-center gap-2 text-emerald-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke {module.program.name}
          </Link>

          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-emerald-200" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm capitalize">
                  {module.level}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{module.name}</h1>
              <p className="text-emerald-50 max-w-2xl mb-6">{module.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-200" />
                  <span>{module.lessons.length} Pelajaran</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-200" />
                  <span>~{module.lessons.length * 8} menit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-300" />
                  <span>+{module.totalExp} EXP</span>
                </div>
              </div>
            </div>
          </div>

          {user && (
            <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Progress Modul</span>
                <span className="text-emerald-200">
                  {completedLessons} / {module.lessons.length} Pelajaran
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
          {module.lessons.map((lesson, index) => {
            const isCompleted = user?.progress[lesson.id]?.completed;
            const prevLesson = index > 0 ? module.lessons[index - 1] : null;
            const isLocked = index > 0 && prevLesson && !user?.progress[prevLesson.id]?.completed && !isCompleted;

            return (
              <Link
                key={lesson.id}
                href={isLocked ? '#' : `/languages/${languageId}/${moduleId}/lessons/${lesson.id}`}
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

        {module.lessons.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada pelajaran dalam modul ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
