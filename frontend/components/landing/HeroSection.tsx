'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Play, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import Link from 'next/link';

export function HeroSection() {
  const { login, authenticated } = usePrivy();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Lisk Builders Challenge Round 3
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Bicara Seperti{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Warga Lokal
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-xl">
              Pelajari bahasa daerah Indonesia secara terstruktur. Dapatkan sertifikat terverifikasi on-chain sebagai bukti kemampuan Anda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {authenticated ? (
                <Link href="/languages">
                  <Button size="lg" className="w-full sm:w-auto">
                    Pilih Bahasa
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Button size="lg" onClick={() => login()} className="w-full sm:w-auto">
                  Mulai Gratis
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              )}
              <Button variant="outline" size="lg" className="w-full sm:w-auto group">
                <Play className="w-5 h-5 mr-2 group-hover:text-emerald-600" />
                Lihat Demo
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-8 justify-center lg:justify-start">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">2+</p>
                <p className="text-sm text-gray-500">Bahasa Daerah</p>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">20+</p>
                <p className="text-sm text-gray-500">Pelajaran</p>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">100%</p>
                <p className="text-sm text-gray-500">Terverifikasi</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-white rounded-3xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🏝️</span>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Bahasa Banjar</p>
                    <p className="text-emerald-100 text-sm">Kalimantan Selatan</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-emerald-100 text-sm mb-1">Pelajaran 1</p>
                    <p className="font-medium">&ldquo;Halo, siapa ngaran ikam?&rdquo;</p>
                    <p className="text-emerald-200 text-sm mt-1">Halo, siapa nama kamu?</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-amber-900">+100</span>
                      </div>
                      <span className="text-sm">EXP</span>
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      8 menit
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-amber-400 text-amber-900 px-4 py-2 rounded-xl font-semibold text-sm shadow-lg">
                🎯 Praktis & Terstruktur
              </div>
            </div>

            <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-xl p-4 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">✅</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Sertifikat On-Chain</p>
                  <p className="text-gray-500 text-xs">Dapat diverifikasi siapapun</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
