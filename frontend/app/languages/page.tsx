'use client';

import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';
import { languages } from '@/lib/data';
import { useState } from 'react';

export default function LanguagesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Pilih Bahasa
          </h1>
          <p className="text-neutral-500">
            Mulai perjalanan belajar bahasa daerah Indonesia
          </p>
        </div>

        <div className="max-w-sm mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari bahasa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-neutral-200 focus:border-neutral-400 outline-none transition-colors text-sm"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filteredLanguages.map((language) => (
            <Link key={language.id} href={`/languages/${language.id}`}>
              <div className="group p-6 bg-white rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-2xl flex-shrink-0">
                    {language.flag}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-neutral-900 mb-1">
                      {language.name}
                    </h2>
                    <p className="text-sm text-neutral-500 mb-3">{language.region}</p>
                    <div className="flex items-center gap-4 text-xs text-neutral-400">
                      <span>{language.totalLessons} Pelajaran</span>
                      <span>~{language.totalLessons * 10} menit</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-neutral-500 transition-colors flex-shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredLanguages.length === 0 && (
          <div className="text-center py-16">
            <p className="text-neutral-500">
              Tidak ada bahasa ditemukan untuk &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}

        <div className="mt-12 p-6 bg-neutral-50 rounded-2xl">
          <p className="text-sm text-neutral-500 text-center">
            Bahasa baru segera hadir: Jawa, Sunda, Minang, dan lainnya
          </p>
        </div>
      </div>
    </div>
  );
}
