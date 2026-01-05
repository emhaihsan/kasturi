'use client';

import { usePrivy } from '@privy-io/react-auth';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import Link from 'next/link';

export function CTASection() {
  const { login, authenticated } = usePrivy();

  return (
    <section className="py-24 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-emerald-100 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Mulai perjalanan belajar Anda hari ini
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Siap Bicara Seperti Warga Lokal?
        </h2>

        <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
          Bergabung dengan ribuan learner yang sudah membuktikan kemampuan bahasa daerah mereka dengan sertifikat terverifikasi.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {authenticated ? (
            <Link href="/languages">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-xl"
              >
                Pilih Bahasa Sekarang
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              onClick={() => login()}
              className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-xl"
            >
              Daftar Gratis Sekarang
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>

        <p className="mt-6 text-emerald-200 text-sm">
          Tidak perlu kartu kredit • Login dengan email atau social media
        </p>
      </div>
    </section>
  );
}
