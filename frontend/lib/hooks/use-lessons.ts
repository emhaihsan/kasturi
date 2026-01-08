'use client';

import { useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';

interface Lesson {
  id: string;
  title: string;
  description: string;
  expReward: number;
  orderIndex: number;
  content?: any;
}

interface Program {
  id: string;
  programId: string;
  name: string;
  language: string;
  lessons: Lesson[];
}

interface LessonProgress {
  lessonId: string;
  expEarned: number;
  txHash: string | null;
  programComplete: boolean;
  completedLessons: number;
  totalLessons: number;
}

export function useLessons() {
  const { user } = usePrivy();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const walletAddress = user?.wallet?.address;

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/lessons');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data.programs as Program[];
    } catch (e: any) {
      setError(e.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLesson = useCallback(async (lessonId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/lessons/${lessonId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data.lesson;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeLesson = useCallback(async (lessonId: string, score: number = 100): Promise<LessonProgress | null> => {
    if (!walletAddress) {
      setError('Please connect your wallet');
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, score }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data.progress as LessonProgress;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  const fetchProgress = useCallback(async () => {
    if (!walletAddress) return null;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/user/progress?walletAddress=${walletAddress}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  const claimCredential = useCallback(async (programId: string) => {
    if (!walletAddress) {
      setError('Please connect your wallet');
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/credentials/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, programId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data.credential;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  return {
    loading,
    error,
    walletAddress,
    fetchPrograms,
    fetchLesson,
    completeLesson,
    fetchProgress,
    claimCredential,
  };
}
