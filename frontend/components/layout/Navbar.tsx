'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Menu, X, User, Wallet, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAppStore } from '@/lib/store';
import { useWallet } from '@/lib/hooks/useWallet';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { login, logout, authenticated, user: privyUser, ready } = usePrivy();
  const { user, setUser, setAuthenticated, isAuthenticated } = useAppStore();
  const { address, balanceFormatted, isEmbedded, getExplorerUrl } = useWallet();

  const isLandingPage = pathname === '/';
  const isLoggedIn = authenticated || isAuthenticated;

  useEffect(() => {
    if (ready && authenticated && privyUser) {
      setAuthenticated(true);
      
      // Sync user data with backend
      const syncUser = async () => {
        try {
          const response = await fetch('/api/user/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              walletAddress: privyUser?.wallet?.address,
              email: privyUser?.email?.address || null,
              displayName: privyUser?.email?.address?.split('@')[0] || null,
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          }
        } catch (error) {
          console.error('Failed to sync user:', error);
        }
      };
      
      if (!user) {
        syncUser();
      }
    }
  }, [ready, authenticated, privyUser, setAuthenticated, setUser, user]);

  const handleLogin = async () => {
    try {
      await login();
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    setAuthenticated(false);
    setUser(null);
    setIsProfileOpen(false);
    router.push('/');
  };

  // Floating navbar for landing page (even when logged in)
  if (isLandingPage) {
    return (
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl">
        <div className="bg-[var(--surface)] rounded-2xl neo-border neo-shadow px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img src="/icon.webp" alt="Kasturi" className="w-9 h-9 rounded-xl neo-border" />
              <span className="text-lg font-extrabold text-neutral-900">Kasturi</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#about" className="text-sm font-semibold text-neutral-700 hover:text-neutral-900 transition-colors">
                About
              </Link>
              <Link href="/verify" className="text-sm font-semibold text-neutral-700 hover:text-neutral-900 transition-colors">
                Verify
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-neutral-900 bg-[var(--highlight)] neo-pill transition-all hover:-translate-y-0.5 active:translate-y-0.5"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-neutral-900 bg-[var(--highlight)] neo-pill transition-all hover:-translate-y-0.5 active:translate-y-0.5"
                >
                  Connect
                </button>
              )}
              <button
                className="md:hidden p-2 neo-border rounded-xl bg-white transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="mt-3 bg-[var(--surface)] rounded-2xl neo-border neo-shadow p-4">
            <div className="space-y-2">
              <Link
                href="#about"
                className="block px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-[var(--surface-2)] rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/verify"
                className="block px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-[var(--surface-2)] rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Verify
              </Link>
              <button 
                onClick={() => {
                  handleLogin();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm font-semibold text-neutral-900 bg-[var(--highlight)] neo-pill"
              >
                Connect
              </button>
            </div>
          </div>
        )}
      </nav>
    );
  }

  // Navbar untuk logged-in users (termasuk di landing page)
  if (isLoggedIn) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--surface)] border-b-4 border-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-10">
              <Link href="/dashboard" className="flex items-center gap-2">
                <img src="/icon.webp" alt="Kasturi" className="w-8 h-8 rounded-xl neo-border" />
                <span className="text-xl font-extrabold text-neutral-900">Kasturi</span>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                <Link 
                  href="/dashboard" 
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${pathname === '/dashboard' ? 'bg-white text-neutral-900 font-semibold neo-pill' : 'text-neutral-700 hover:text-neutral-900'}`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/languages" 
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${pathname.startsWith('/languages') ? 'bg-white text-neutral-900 font-semibold neo-pill' : 'text-neutral-700 hover:text-neutral-900'}`}
                >
                  Lessons
                </Link>
                <Link 
                  href="/wallet" 
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${pathname === '/wallet' ? 'bg-white text-neutral-900 font-semibold neo-pill' : 'text-neutral-700 hover:text-neutral-900'}`}
                >
                  Wallet
                </Link>
                <Link 
                  href="/rewards" 
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${pathname === '/rewards' ? 'bg-white text-neutral-900 font-semibold neo-pill' : 'text-neutral-700 hover:text-neutral-900'}`}
                >
                  Rewards
                </Link>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              {/* ETH Balance */}
              {address && (
                <a
                  href={getExplorerUrl(address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-white neo-pill text-sm transition-colors"
                  title="View on Lisk Sepolia Explorer"
                >
                  <Wallet className="w-4 h-4 text-neutral-900" />
                  <span className="font-semibold text-neutral-900">{balanceFormatted} ETH</span>
                  <ExternalLink className="w-3 h-3 text-neutral-700" />
                </a>
              )}

              <div className="flex items-center gap-2 px-4 py-2 bg-white neo-pill text-sm">
                <span className="text-neutral-700">EXP</span>
                <span className="font-semibold text-neutral-900">{user?.totalExp || 0}</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-2 rounded-full bg-white neo-border transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <User className="w-4 h-4 text-neutral-900" />
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl neo-border neo-shadow-sm py-2">
                    <div className="px-4 py-3 border-b border-neutral-900/10">
                      <p className="text-sm font-semibold text-neutral-900">
                        {user?.name && !user.name.startsWith('0x') ? user.name : 'Learner'}
                      </p>
                      <p className="text-xs text-[var(--ink-muted)] truncate">{user?.email}</p>
                      {address && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-neutral-500">Wallet:</span>
                          <code className="text-xs text-neutral-900 font-mono">
                            {address.slice(0, 6)}...{address.slice(-4)}
                          </code>
                          {isEmbedded && (
                            <span className="text-xs bg-white neo-pill text-neutral-900 px-1.5 py-0.5">
                              Embedded
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-neutral-500 mt-1">Lisk Sepolia</p>
                    </div>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-900 hover:bg-[var(--surface)]"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      href="/verify"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-900 hover:bg-[var(--surface)]"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Verify Certificate
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-900 hover:bg-[var(--surface)] w-full"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              className="md:hidden p-2 rounded-xl neo-border bg-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-neutral-900/10">
            <div className="px-4 py-4 space-y-1">
              <Link
                href="/dashboard"
                className={`block px-4 py-3 rounded-xl text-sm ${pathname === '/dashboard' ? 'bg-[var(--surface)] text-neutral-900 font-semibold neo-border' : 'text-neutral-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/languages"
                className={`block px-4 py-3 rounded-xl text-sm ${pathname.startsWith('/languages') ? 'bg-[var(--surface)] text-neutral-900 font-semibold neo-border' : 'text-neutral-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Lessons
              </Link>
              <Link
                href="/wallet"
                className={`block px-4 py-3 rounded-xl text-sm ${pathname === '/wallet' ? 'bg-[var(--surface)] text-neutral-900 font-semibold neo-border' : 'text-neutral-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Wallet
              </Link>
              <Link
                href="/rewards"
                className={`block px-4 py-3 rounded-xl text-sm ${pathname === '/rewards' ? 'bg-[var(--surface)] text-neutral-900 font-semibold neo-border' : 'text-neutral-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Rewards
              </Link>
              <div className="pt-4 mt-4 border-t border-neutral-900/10">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-sm text-neutral-900 hover:bg-[var(--surface)] rounded-xl"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    );
  }

  // Fallback navbar untuk halaman lain saat tidak login
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--surface)] border-b-4 border-neutral-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <img src="/icon.webp" alt="Kasturi" className="w-8 h-8 rounded-xl neo-border" />
            <span className="text-xl font-extrabold text-neutral-900">Kasturi</span>
          </Link>
          <Button onClick={handleLogin}>Connect</Button>
        </div>
      </div>
    </nav>
  );
}
