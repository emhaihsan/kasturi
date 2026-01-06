'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { BookOpen, Users, GraduationCap, Globe, Award } from 'lucide-react';

export function HeroSection() {
  const { login, authenticated } = usePrivy();

  return (
    <section className="bg-white pt-40 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-neutral-100 rounded-full mb-6">
            <p className="text-sm text-neutral-600">Belajar terstruktur • Bukti on-chain</p>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 leading-tight mb-6">
            Bicara Seperti
            <br />
            Warga Lokal
          </h1>
          
          <p className="text-lg text-neutral-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Kasturi membantu perantau belajar bahasa daerah lewat pelajaran singkat berbasis percakapan. Selesaikan modul, kumpulkan EXP sebagai sinyal progres, dan dapatkan credential non-transferable (SBT) yang bisa diverifikasi publik.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            {authenticated ? (
              <Link href="/languages">
                <Button size="lg">
                  Jelajahi Materi
                </Button>
              </Link>
            ) : (
              <Button size="lg" onClick={() => login()}>
                Mulai Belajar
              </Button>
            )}
            <Link href="/verify">
              <Button variant="outline" size="lg">
                Verifikasi Credential
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-[3/4] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl overflow-hidden flex items-center justify-center group hover:shadow-lg transition-shadow">
              <BookOpen className="w-16 h-16 text-neutral-400 group-hover:text-neutral-500" />
            </div>
            <div className="aspect-[3/4] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl overflow-hidden flex items-center justify-center group hover:shadow-lg transition-shadow">
              <Users className="w-16 h-16 text-neutral-400 group-hover:text-neutral-500" />
            </div>
            <div className="aspect-[3/4] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl overflow-hidden flex items-center justify-center group hover:shadow-lg transition-shadow">
              <GraduationCap className="w-16 h-16 text-neutral-400 group-hover:text-neutral-500" />
            </div>
            <div className="aspect-[3/4] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl overflow-hidden flex items-center justify-center group hover:shadow-lg transition-shadow">
              <Award className="w-16 h-16 text-neutral-400 group-hover:text-neutral-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
