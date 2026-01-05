export interface Language {
  id: string;
  name: string;
  region: string;
  flag: string;
  description: string;
  totalLessons: number;
  totalExp: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Lesson {
  id: string;
  languageId: string;
  title: string;
  description: string;
  order: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration: string;
  expReward: number;
  vocabulary: VocabularyItem[];
  exercises: Exercise[];
  completed: boolean;
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
  exampleTranslation: string;
  audioUrl?: string;
}

export interface Exercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'listening';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface UserProgress {
  lessonId: string;
  completed: boolean;
  expEarned: number;
  exerciseScores: Record<string, number>;
  completedAt?: Date;
}

export interface User {
  address?: string;
  email?: string;
  name?: string;
  avatar?: string;
  totalExp: number;
  tokenBalance: number;
  credentials: Credential[];
  vouchers: Voucher[];
  progress: Record<string, UserProgress>;
}

export interface Credential {
  id: string;
  programId: string;
  languageName: string;
  issuedAt: Date;
  tokenId: number;
  verified: boolean;
}

export interface Voucher {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tokenCost: number;
  redeemed: boolean;
  redeemedAt?: Date;
  expiresAt?: Date;
}

export interface ExchangeRate {
  expToToken: number;
  tokenToVoucher: Record<string, number>;
}
