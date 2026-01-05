import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserProgress, Credential, Voucher } from './types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  selectedLanguageId: string | null;
  
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setSelectedLanguage: (languageId: string) => void;
  
  addExp: (amount: number) => void;
  convertExpToTokens: (expAmount: number) => void;
  
  completeLesson: (lessonId: string, expEarned: number) => void;
  updateExerciseScore: (lessonId: string, exerciseId: string, score: number) => void;
  
  addCredential: (credential: Credential) => void;
  addVoucher: (voucher: Voucher) => void;
  redeemVoucher: (voucherId: string) => void;
  
  reset: () => void;
}

const initialUser: User = {
  totalExp: 0,
  tokenBalance: 0,
  credentials: [],
  vouchers: [],
  progress: {},
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      selectedLanguageId: null,

      setUser: (user) => set({ user }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setSelectedLanguage: (languageId) => set({ selectedLanguageId: languageId }),

      addExp: (amount) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              totalExp: user.totalExp + amount,
            },
          });
        }
      },

      convertExpToTokens: (expAmount) => {
        const { user } = get();
        if (user && user.totalExp >= expAmount) {
          const tokensToAdd = Math.floor(expAmount / 10);
          set({
            user: {
              ...user,
              totalExp: user.totalExp - expAmount,
              tokenBalance: user.tokenBalance + tokensToAdd,
            },
          });
        }
      },

      completeLesson: (lessonId, expEarned) => {
        const { user } = get();
        if (user) {
          const existingProgress = user.progress[lessonId];
          if (!existingProgress?.completed) {
            set({
              user: {
                ...user,
                totalExp: user.totalExp + expEarned,
                progress: {
                  ...user.progress,
                  [lessonId]: {
                    lessonId,
                    completed: true,
                    expEarned,
                    exerciseScores: existingProgress?.exerciseScores || {},
                    completedAt: new Date(),
                  },
                },
              },
            });
          }
        }
      },

      updateExerciseScore: (lessonId, exerciseId, score) => {
        const { user } = get();
        if (user) {
          const existingProgress = user.progress[lessonId] || {
            lessonId,
            completed: false,
            expEarned: 0,
            exerciseScores: {},
          };
          set({
            user: {
              ...user,
              progress: {
                ...user.progress,
                [lessonId]: {
                  ...existingProgress,
                  exerciseScores: {
                    ...existingProgress.exerciseScores,
                    [exerciseId]: score,
                  },
                },
              },
            },
          });
        }
      },

      addCredential: (credential) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              credentials: [...user.credentials, credential],
            },
          });
        }
      },

      addVoucher: (voucher) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              tokenBalance: user.tokenBalance - voucher.tokenCost,
              vouchers: [...user.vouchers, voucher],
            },
          });
        }
      },

      redeemVoucher: (voucherId) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              vouchers: user.vouchers.map((v) =>
                v.id === voucherId
                  ? { ...v, redeemed: true, redeemedAt: new Date() }
                  : v
              ),
            },
          });
        }
      },

      reset: () => set({ user: null, isAuthenticated: false, selectedLanguageId: null }),
    }),
    {
      name: 'kasturi-storage',
    }
  )
);
