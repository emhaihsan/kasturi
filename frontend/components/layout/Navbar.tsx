'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Menu, X, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAppStore } from '@/lib/store';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { login, logout, authenticated, user: privyUser, ready } = usePrivy();
  const { user, setUser, setAuthenticated, isAuthenticated } = useAppStore();

  const isLandingPage = pathname === '/';
  const isLoggedIn = authenticated || isAuthenticated;

  useEffect(() => {
    if (ready && authenticated && privyUser) {
      setAuthenticated(true);
      if (!user) {
        setUser({
          address: privyUser?.wallet?.address,
          email: privyUser?.email?.address,
          name: privyUser?.email?.address?.split('@')[0] || 'Learner',
          totalExp: 0,
          tokenBalance: 0,
          credentials: [],
          vouchers: [],
          progress: {},
        });
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
  };

  // Floating navbar untuk landing page
  if (!isLoggedIn && isLandingPage) {
    return (
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                K
              </div>
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
                  href="/rewards" 
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${pathname === '/rewards' ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-600 hover:text-neutral-900'}`}
                >
                  Rewards
                </Link>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
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
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 py-2">
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-medium text-neutral-900">{user?.name || 'Learner'}</p>
                      <p className="text-xs text-neutral-500 truncate">{user?.email || user?.address}</p>
                    </div>
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
