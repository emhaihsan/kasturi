'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Menu, X, User, Wallet, ExternalLink, Coins } from 'lucide-react';
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
  const { address, balanceFormatted, tokenBalanceFormatted, isEmbedded, getExplorerUrl, refreshWallet } = useWallet();

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

  // Floating navbar untuk landing page
  if (!isLoggedIn && isLandingPage) {
    return (
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img src="/icon.webp" alt="Kasturi" className="w-8 h-8" />
              <span className="text-lg font-bold text-neutral-900">Kasturi</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#about" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                About
              </Link>
              <Link href="/verify" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                Verify
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleLogin}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-colors"
              >
                Connect
              </button>
              <button
                className="md:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="mt-2 bg-white rounded-2xl shadow-lg border border-neutral-100 p-4">
            <div className="space-y-2">
              <Link
                href="#about"
                className="block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/verify"
                className="block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Verify
              </Link>
              <button 
                onClick={() => {
                  handleLogin();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg"
              >
                Connect
              </button>
            </div>
          </div>
        )}
      </nav>
    );
  }

  // Navbar untuk logged-in users
  if (isLoggedIn && !isLandingPage) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-10">
              <Link href="/dashboard" className="flex items-center gap-2">
                <img src="/icon.webp" alt="Kasturi" className="w-8 h-8" />
                <span className="text-xl font-bold text-neutral-900">Kasturi</span>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                <Link 
                  href="/dashboard" 
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${pathname === '/dashboard' ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-600 hover:text-neutral-900'}`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/languages" 
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${pathname.startsWith('/languages') ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-600 hover:text-neutral-900'}`}
                >
                  Pelajaran
                </Link>
                <Link 
                  href="/wallet" 
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${pathname === '/wallet' ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-600 hover:text-neutral-900'}`}
                >
                  Wallet
                </Link>
                <Link 
                  href="/rewards" 
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${pathname === '/rewards' ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-600 hover:text-neutral-900'}`}
                >
                  Rewards
                </Link>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              {/* KASTURI Token Balance */}
              <Link
                href="/wallet"
                className="flex items-center gap-2 px-3 py-2 bg-amber-50 hover:bg-amber-100 rounded-full text-sm transition-colors"
                title="KASTURI Token Balance"
              >
                <Coins className="w-4 h-4 text-amber-600" />
                <span className="font-medium text-amber-700">{tokenBalanceFormatted} KSTR</span>
              </Link>

              {/* ETH Balance */}
              {address && (
                <a
                  href={getExplorerUrl(address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-full text-sm transition-colors"
                  title="View on Lisk Sepolia Explorer"
                >
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-emerald-700">{balanceFormatted} ETH</span>
                  <ExternalLink className="w-3 h-3 text-emerald-500" />
                </a>
              )}

              <div className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full text-sm">
                <span className="text-neutral-500">EXP</span>
                <span className="font-semibold text-neutral-900">{user?.totalExp || 0}</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-neutral-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
                    <User className="w-4 h-4 text-neutral-600" />
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-neutral-200 py-2">
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-medium text-neutral-900">
                        {user?.name && !user.name.startsWith('0x') ? user.name : 'Learner'}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                      {address && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-neutral-400">Wallet:</span>
                          <code className="text-xs text-emerald-600 font-mono">
                            {address.slice(0, 6)}...{address.slice(-4)}
                          </code>
                          {isEmbedded && (
                            <span className="text-xs bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded">
                              Embedded
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-neutral-400 mt-1">Lisk Sepolia</p>
                    </div>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Pengaturan Profil
                    </Link>
                    <Link
                      href="/verify"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Verifikasi Sertifikat
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 w-full"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              className="md:hidden p-2 rounded-full hover:bg-neutral-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-neutral-100">
            <div className="px-4 py-4 space-y-1">
              <Link
                href="/dashboard"
                className={`block px-4 py-3 rounded-xl text-sm ${pathname === '/dashboard' ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/languages"
                className={`block px-4 py-3 rounded-xl text-sm ${pathname.startsWith('/languages') ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Pelajaran
              </Link>
              <Link
                href="/wallet"
                className={`block px-4 py-3 rounded-xl text-sm ${pathname === '/wallet' ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Wallet
              </Link>
              <Link
                href="/rewards"
                className={`block px-4 py-3 rounded-xl text-sm ${pathname === '/rewards' ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Rewards
              </Link>
              <div className="pt-4 mt-4 border-t border-neutral-100">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-sm text-neutral-600 hover:bg-neutral-50 rounded-xl"
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    );
  }

  return null;
}
