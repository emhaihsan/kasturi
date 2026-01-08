'use client';

import { useCallback } from 'react';
import { useWallet } from './useWallet';
import { useAppStore } from '@/lib/store';

export function useLessonProgress() {
  const { address } = useWallet();
  const { completeLesson: updateLocalStore } = useAppStore();

  /**
   * Complete a lesson and save to database
   */
  const completeLesson = useCallback(async (
    lessonId: string,
    expReward: number,
    score?: number
  ): Promise<{ success: boolean; error?: string }> => {
    if (!address) {
      return { success: false, error: 'Wallet not connected' };
    }

    try {
      const response = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          score: score || 100,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to save progress' };
      }

      // Update local store
      updateLocalStore(lessonId, expReward);

      return { success: true };
    } catch (error) {
      console.error('Error completing lesson:', error);
      return { success: false, error: 'Network error' };
    }
  }, [address, updateLocalStore]);

  return {
    completeLesson,
  };
}
