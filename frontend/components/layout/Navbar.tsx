'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { Menu, X, User, LogOut, Wallet, Star, Gift, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAppStore } from '@/lib/store';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { login, logout, authenticated, user: privyUser } = usePrivy();
  const { user, setUser, setAuthenticated } = useAppStore();

  const handleLogin = async () => {
    try {
      await login();
      setAuthenticated(true);
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌺</span>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Kasturi
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/languages" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Bahasa
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Tentang
            </Link>
            <Link href="/verify" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Verifikasi
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {authenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold text-gray-700">{user.totalExp} EXP</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-emerald-600" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user.name || 'Learner'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email || user.address}</p>
                    </div>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">EXP</span>
                        <span className="font-semibold text-amber-600">{user.totalExp}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">Token</span>
                        <span className="font-semibold text-emerald-600">{user.tokenBalance}</span>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/rewards"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Gift className="w-4 h-4" />
                      Rewards
                    </Link>
                    <Link
                      href="/wallet"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Wallet className="w-4 h-4" />
                      Wallet
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button onClick={handleLogin}>Mulai Belajar</Button>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/languages"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Bahasa
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Tentang
            </Link>
            <Link
              href="/verify"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Verifikasi
            </Link>
            {authenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Keluar
                </button>
              </>
            ) : (
              <Button onClick={handleLogin} className="w-full">
                Mulai Belajar
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
