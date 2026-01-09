import { useState, useEffect } from 'react';

interface Module {
  id: string;
  moduleId: string;
  name: string;
  description: string | null;
  lessons: Lesson[];
}

interface Program {
  id: string;
  programId: string;
  name: string;
  description: string | null;
  language: string;
  level: string;
  totalExp: number;
  isActive: boolean;
  lessonCount?: number;
  lessons: Lesson[];
  modules?: Module[];
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  duration: string | null;
  expReward: number;
  orderIndex: number;
}

export function usePrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await fetch('/api/programs');
        if (!res.ok) throw new Error('Failed to fetch programs');
        const data = await res.json();
        setPrograms(data.programs || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchPrograms();
  }, []);

  return { programs, loading, error };
}

interface LessonDetail extends Lesson {
  content: {
    vocabulary: Array<{
      banjar: string;
      indonesian: string;
      english: string;
    }>;
    exercises: Array<{
      type: string;
      question: string;
      options?: string[];
      correct?: number;
      answer?: string;
    }>;
  };
  program: {
    id: string;
    programId: string;
    name: string;
    language: string;
  };
}

export function useLesson(lessonId: string) {
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const res = await fetch(`/api/programs/x/lessons/${lessonId}`);
        if (!res.ok) throw new Error('Failed to fetch lesson');
        const data = await res.json();
        setLesson(data.lesson);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  return { lesson, loading, error };
}

// Helper to get YouTube embed URL
export function getYouTubeEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (videoIdMatch && videoIdMatch[1]) {
    return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
  }
  return null;
}

// Helper to get YouTube thumbnail
export function getYouTubeThumbnail(url: string | null): string | null {
  if (!url) return null;
  const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (videoIdMatch && videoIdMatch[1]) {
    return `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`;
  }
  return null;
}
