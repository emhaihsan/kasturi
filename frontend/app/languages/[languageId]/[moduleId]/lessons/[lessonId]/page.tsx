'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Play,
  Volume2,
  CheckCircle,
  XCircle,
  Star,
  BookOpen,
  ChevronRight,
  Award,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useLesson, getYouTubeEmbedUrl } from '@/lib/hooks/usePrograms';
import { useLessonProgress } from '@/lib/hooks/useLessonProgress';

type Tab = 'materi' | 'exercises';

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const languageId = params.languageId as string;
  const moduleId = params.moduleId as string;
  const lessonId = params.lessonId as string;

  const { user, updateExerciseScore } = useAppStore();
  const { lesson, loading, error } = useLesson(lessonId);
  const { completeLesson } = useLessonProgress();
  const [activeTab, setActiveTab] = useState<Tab>('materi');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-500">Loading lesson...</div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pelajaran tidak ditemukan</h1>
          <Link href={`/languages/${languageId}/${moduleId}`} className="text-emerald-600 hover:underline">
            Kembali ke daftar pelajaran
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = user?.progress[lesson.id]?.completed;
  const vocabulary = lesson.content?.vocabulary || [];
  const exercises = lesson.content?.exercises || [];
  const exercise = exercises[currentExercise];
  const embedUrl = getYouTubeEmbedUrl(lesson.videoUrl);

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer || !exercise) return;
    setShowResult(true);

    const isCorrect = selectedAnswer === exercise.options?.[exercise.correct || 0];
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      updateExerciseScore(lesson.id, `ex-${currentExercise}`, 1);
    } else {
      updateExerciseScore(lesson.id, `ex-${currentExercise}`, 0);
    }
  };

  const handleNextExercise = async () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const score = Math.round((correctAnswers / exercises.length) * 100);
      if (score >= 70 && !isCompleted) {
        await completeLesson(lesson.id, lesson.expReward, score);
      }
      setActiveTab('materi');
    }
  };

  const handleCompleteLesson = async () => {
    if (!isCompleted) {
      await completeLesson(lesson.id, lesson.expReward);
    }
    router.push(`/languages/${languageId}/${moduleId}`);
  };

  const tabs = [
    { id: 'materi' as Tab, label: 'Materi', icon: BookOpen },
    { id: 'exercises' as Tab, label: 'Latihan', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/languages/${languageId}/${moduleId}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali ke Modul</span>
            </Link>

            <div className="flex items-center gap-2">
              {isCompleted && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Selesai
                </span>
              )}
              <span className="text-amber-600 font-semibold flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400" />
                +{lesson.expReward} EXP
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pelajaran {lesson.orderIndex}: {lesson.title}
          </h1>
          <p className="text-gray-600">{lesson.description}</p>
        </div>

        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'materi' && (
          <div className="space-y-8">
            <div>
              <div className="mb-8">
                {embedUrl && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Play className="w-5 h-5 text-emerald-600" />
                      Video Pelajaran
                    </h2>
                    <Card className="overflow-hidden">
                      <div className="aspect-video">
                        <iframe
                          src={embedUrl}
                          title={lesson.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </Card>
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Kosakata Penting
              </h2>
              <div className="space-y-4">
                {vocabulary.map((vocab: any, index: number) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xl font-bold text-gray-900">{vocab.banjar}</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-lg text-emerald-600">{vocab.indonesian}</span>
                          <button className="p-1 hover:bg-gray-100 rounded-full">
                            <Volume2 className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                        {vocab.english && (
                          <p className="text-sm text-gray-500 mb-3">{vocab.english}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setActiveTab('exercises')} size="lg">
                Mulai Latihan
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'exercises' && exercise && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm text-gray-500">
                Soal {currentExercise + 1} dari {exercises.length}
              </span>
              <div className="flex gap-1">
                {exercises.map((_: any, idx: number) => (
                  <div
                    key={idx}
                    className={`w-8 h-2 rounded-full ${
                      idx < currentExercise
                        ? 'bg-emerald-500'
                        : idx === currentExercise
                        ? 'bg-emerald-300'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <Card className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{exercise.question}</h3>

              <div className="space-y-3 mb-8">
                {exercise.options?.map((option: string, idx: number) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = idx === exercise.correct;
                  const showCorrect = showResult && isCorrect;
                  const showWrong = showResult && isSelected && !isCorrect;

                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={showResult}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        showCorrect
                          ? 'border-emerald-500 bg-emerald-50'
                          : showWrong
                          ? 'border-red-500 bg-red-50'
                          : isSelected
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {showCorrect && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                        {showWrong && <XCircle className="w-5 h-5 text-red-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end gap-4">
                {!showResult ? (
                  <Button onClick={handleCheckAnswer} disabled={!selectedAnswer}>
                    Periksa Jawaban
                  </Button>
                ) : (
                  <Button onClick={handleNextExercise}>
                    {currentExercise < exercises.length - 1 ? 'Lanjut' : 'Selesai'}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'exercises' && !exercise && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Latihan Selesai!</h2>
            <p className="text-gray-600 mb-8">
              Anda telah menyelesaikan semua latihan untuk pelajaran ini.
            </p>
            <Button size="lg" onClick={handleCompleteLesson}>
              {isCompleted ? 'Lanjut ke Pelajaran Berikutnya' : 'Selesaikan & Dapatkan EXP'}
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
