'use client';

import Link from 'next/link';
import { BookOpen, Clock, Star, ChevronRight, Search } from 'lucide-react';
import { languages } from '@/lib/data';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

export default function LanguagesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pilih Bahasa Daerah
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mulai perjalanan belajar bahasa daerah Indonesia dengan modul-modul terstruktur
          </p>
        </div>

        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari bahasa atau wilayah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLanguages.map((language) => (
            <Link key={language.id} href={`/languages/${language.id}`}>
              <Card hover className="h-full">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-3xl flex-shrink-0">
                      {language.flag}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {language.name}
                      </h2>
                      <p className="text-gray-500">{language.region}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  </div>

                  <p className="text-gray-600 mb-6 line-clamp-2">{language.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      <span>{language.totalLessons} Pelajaran</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>~{language.totalLessons * 10} menit</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                      {language.difficulty === 'beginner' ? 'Pemula' : language.difficulty === 'intermediate' ? 'Menengah' : 'Mahir'}
                    </span>
                    <div className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>+{language.totalExp} EXP</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredLanguages.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              Tidak ada bahasa yang ditemukan untuk &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-amber-50 rounded-2xl border border-amber-100">
            <span className="text-2xl">🚀</span>
            <div className="text-left">
              <p className="font-semibold text-amber-800">Bahasa baru segera hadir!</p>
              <p className="text-sm text-amber-600">Bahasa Jawa, Sunda, Minang, dan lainnya</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
