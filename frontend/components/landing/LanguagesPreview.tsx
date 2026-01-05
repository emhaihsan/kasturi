'use client';

import Link from 'next/link';
import { ChevronRight, BookOpen, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { languages } from '@/lib/data';

export function LanguagesPreview() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Pilih Bahasa Daerah
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mulai perjalanan belajar Anda dengan bahasa daerah pilihan
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {languages.map((language) => (
            <Link key={language.id} href={`/languages/${language.id}`}>
              <div className="group bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 cursor-pointer">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {language.flag}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {language.name}
                    </h3>
                    <p className="text-gray-500">{language.region}</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>

                <p className="text-gray-600 mb-6">{language.description}</p>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <BookOpen className="w-4 h-4" />
                    <span>{language.totalLessons} Pelajaran</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>~{Math.round(language.totalLessons * 10)} menit</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                      {language.difficulty === 'beginner' ? 'Pemula' : language.difficulty === 'intermediate' ? 'Menengah' : 'Mahir'}
                    </span>
                    <span className="text-amber-600 font-semibold">
                      +{language.totalExp} EXP
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/languages">
            <Button variant="outline" size="lg">
              Lihat Semua Bahasa
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
