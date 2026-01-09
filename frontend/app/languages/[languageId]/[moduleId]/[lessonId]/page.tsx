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
          <p className="text-red-500 mb-4">Error loading lesson</p>
          <Link href={`/languages/${languageId}/${moduleId}`}>
            <Button variant="outline">Back to Module</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = user?.progress?.[lesson.id]?.completed || false;
  const vocabulary = lesson.content?.vocabulary || [];
  const exercises = lesson.content?.exercises || [];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const currentEx = exercises[currentExercise];
    if (!currentEx?.options) return;
    
    const isCorrect = selectedAnswer === currentEx.options[currentEx.correct ?? 0];

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        handleCompleteLesson();
      }
    }, 1500);
  };

  const handleCompleteLesson = async () => {
    const score = exercises.length > 0 ? Math.round((correctAnswers / exercises.length) * 100) : 100;
    await completeLesson(lesson.id, lesson.expReward, score);
  };

  const currentEx = exercises[currentExercise] as { question?: string; options?: string[]; correct?: number } | undefined;
  const isCorrect = currentEx?.options && selectedAnswer === currentEx.options[currentEx.correct ?? 0];

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/languages/${languageId}/${moduleId}`}
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Module
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-neutral-900">{lesson.title}</h1>
            {isCompleted && (
              <div className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Completed
              </div>
            )}
          </div>
          <p className="text-neutral-600">{lesson.description || ''}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-neutral-500">
            <span>{lesson.duration || ''}</span>
            <span>•</span>
            <div className="flex items-center gap-1 text-amber-600 font-medium">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>+{lesson.expReward} EXP</span>
            </div>
          </div>
        </div>

        {lesson.videoUrl && (
          <div className="mb-8">
            <div className="aspect-video rounded-2xl overflow-hidden bg-neutral-100">
              <iframe
                src={getYouTubeEmbedUrl(lesson.videoUrl || '')}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('materi')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'materi'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Materi
            </div>
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'exercises'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Latihan ({exercises.length})
            </div>
          </button>
        </div>

        {activeTab === 'materi' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Vocabulary</h2>
              <div className="space-y-3">
                {vocabulary.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                  >
                    <Volume2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="font-semibold text-neutral-900">{item.banjar}</span>
                        <span className="text-neutral-600">{item.indonesian}</span>
                      </div>
                      <span className="text-sm text-neutral-500">{item.english}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'exercises' && (
          <div className="space-y-6">
            {currentExercise < exercises.length ? (
              <Card className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-neutral-500">
                      Question {currentExercise + 1} of {exercises.length}
                    </span>
                    <span className="text-sm font-medium text-emerald-600">
                      {correctAnswers} correct
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{
                        width: `${((currentExercise + 1) / exercises.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-neutral-900 mb-6">
                  {currentEx?.question}
                </h3>

                <div className="space-y-3 mb-6">
                  {currentEx?.options?.map((option: string, index: number) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrectAnswer = currentEx?.options && option === currentEx.options[currentEx.correct ?? 0];
                    const showCorrect = showResult && isCorrectAnswer;
                    const showIncorrect = showResult && isSelected && !isCorrectAnswer;

                    return (
                      <button
                        key={index}
                        onClick={() => !showResult && handleAnswerSelect(option)}
                        disabled={showResult}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          showCorrect
                            ? 'border-emerald-500 bg-emerald-50'
                            : showIncorrect
                            ? 'border-red-500 bg-red-50'
                            : isSelected
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-neutral-200 hover:border-emerald-300 hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{option}</span>
                          {showCorrect && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                          {showIncorrect && <XCircle className="w-5 h-5 text-red-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {!showResult && (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer}
                    className="w-full"
                  >
                    Submit Answer
                  </Button>
                )}

                {showResult && (
                  <div
                    className={`p-4 rounded-xl ${
                      isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Correct!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5" />
                          <span className="font-medium">
                            Incorrect. The correct answer is: {currentEx?.options?.[currentEx?.correct ?? 0]}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-8 text-center bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-emerald-800 mb-2">🎉 Selamat!</h3>
                <p className="text-emerald-700 mb-2 text-lg">Pelajaran Selesai!</p>
                <p className="text-emerald-600 mb-6">
                  Kamu menjawab <span className="font-bold text-emerald-800">{correctAnswers}</span> dari <span className="font-bold">{exercises.length}</span> soal dengan benar
                </p>
                
                <div className="bg-white/80 rounded-xl p-4 mb-6 inline-block">
                  <div className="flex items-center gap-2 text-amber-600">
                    <Star className="w-5 h-5 fill-amber-400" />
                    <span className="font-bold text-lg">+{lesson.expReward} EXP</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href={`/languages/${languageId}/${moduleId}`}>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Kembali ke Modul
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Lihat Progress
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
