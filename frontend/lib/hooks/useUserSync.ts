import { useEffect, useRef } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useAppStore } from '@/lib/store';

/**
 * Hook to sync user data from Privy to database and local store
 * Handles both wallet and email authentication
 */
export function useUserSync() {
  const { authenticated, user: privyUser, ready } = usePrivy();
  const { wallets } = useWallets();
  const { setUser, setAuthenticated, user: localUser } = useAppStore();
  const syncedRef = useRef(false);

  useEffect(() => {
    async function syncUser() {
      if (!ready || !authenticated || !privyUser) {
        setAuthenticated(false);
        syncedRef.current = false;
        return;
      }

      // Prevent double sync
      if (syncedRef.current) return;

      try {
        // Get wallet address from useWallets hook (more reliable)
        let walletAddress: string | undefined;
        
        // First try wallets from useWallets
        if (wallets && wallets.length > 0) {
          // Prefer embedded wallet for seamless UX
          const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
          walletAddress = embeddedWallet?.address || wallets[0]?.address;
        }
        
        // Fallback to privyUser.wallet
        if (!walletAddress) {
          walletAddress = privyUser.wallet?.address;
        }

        // Extract email
        const email = privyUser.email?.address;

        // Extract display name
        const displayName = 
          privyUser.google?.name ||
          privyUser.twitter?.name ||
          email?.split('@')[0] ||
          walletAddress?.slice(0, 6);

        // Sync with backend
        const response = await fetch('/api/user/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress,
            email,
            displayName,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to sync user');
        }

        const data = await response.json();
        
        // Update local store
        setUser(data.user);
        setAuthenticated(true);

        console.log('✅ User synced:', {
          id: data.user.id,
          wallet: walletAddress,
          email,
          totalExp: data.user.totalExp,
        });
        syncedRef.current = true;
      } catch (error) {
        console.error('❌ Error syncing user:', error);
        // Don't clear auth on sync error - user is still authenticated via Privy
        setAuthenticated(true);
      }
    }

    syncUser();
  }, [ready, authenticated, privyUser, wallets, setUser, setAuthenticated]);

  return {
    isAuthenticated: authenticated,
    privyUser,
    localUser,
  };
}
