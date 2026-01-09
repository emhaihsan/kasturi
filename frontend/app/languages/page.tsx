'use client';

import Link from 'next/link';
import { Search, ArrowRight, Clock, Lock } from 'lucide-react';
import { languages } from '@/lib/data';
import { useState, useEffect } from 'react';
import { useInView } from '@/hooks/useInView';

interface ProgramData {
  id: string;
  programId: string;
  name: string;
  description: string;
  language: string;
  level: string;
  totalExp: number;
  lessonCount: number;
}

export default function LanguagesPage() {
  const { ref: headerRef, isInView: headerInView } = useInView();
  const { ref: gridRef, isInView: gridInView } = useInView();
  const [searchQuery, setSearchQuery] = useState('');
  const [dbPrograms, setDbPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch programs from database
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch('/api/programs');
        if (response.ok) {
          const data = await response.json();
          setDbPrograms(data.programs || []);
        }
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  // Merge database programs with static coming soon languages
  const allLanguages = languages.map(lang => {
    const dbProgram = dbPrograms.find(p => p.language === lang.id);
    if (dbProgram && !lang.comingSoon) {
      return {
        ...lang,
        id: dbProgram.programId, // Use programId as the route parameter
        totalLessons: dbProgram.lessonCount,
        totalExp: dbProgram.totalExp,
        programId: dbProgram.programId,
        fromDb: true,
      };
    }
    return { ...lang, fromDb: false };
  });

  const filteredLanguages = allLanguages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate active and coming soon
  const activeLanguages = filteredLanguages.filter(l => !l.comingSoon);
  const comingSoonLanguages = filteredLanguages.filter(l => l.comingSoon);

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10" ref={headerRef}>
          <h1 className={`text-3xl font-bold text-neutral-900 mb-2 transition-all duration-700 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Pilih Bahasa Daerah
          </h1>
          <p className={`text-neutral-500 transition-all duration-700 delay-100 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Mulai perjalanan belajar bahasa daerah Indonesia
          </p>
        </div>

        <div className={`max-w-sm mb-8 transition-all duration-700 delay-200 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari bahasa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-neutral-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Active Languages */}
        {activeLanguages.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">Tersedia Sekarang</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-10" ref={gridRef}>
              {activeLanguages.map((language, idx) => (
                <Link key={language.id} href={`/languages/${language.id}`}>
                  <div className={`group p-6 bg-white rounded-2xl border-2 border-green-200 hover:border-green-500 hover:shadow-xl transition-all duration-500 ${gridInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${idx * 100}ms` }}>
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-2xl flex-shrink-0">
                        {language.flag}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="font-semibold text-neutral-900">
                            {language.name}
                          </h2>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Aktif
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500 mb-3">{language.region}</p>
                        <div className="flex items-center gap-4 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {language.totalLessons} Pelajaran
                          </span>
                          <span>{language.totalExp} EXP</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-green-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Coming Soon Languages */}
        {comingSoonLanguages.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">Segera Hadir</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comingSoonLanguages.map((language, idx) => (
                <div 
                  key={language.id} 
                  className={`p-5 bg-neutral-50 rounded-2xl border border-neutral-200 opacity-70 cursor-not-allowed transition-all duration-500 ${gridInView ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-10'}`} 
                  style={{ transitionDelay: `${(activeLanguages.length + idx) * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-neutral-200 flex items-center justify-center text-xl flex-shrink-0 grayscale">
                      {language.flag}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-medium text-neutral-700 text-sm">
                          {language.name}
                        </h2>
                      </div>
                      <p className="text-xs text-neutral-400 mb-2">{language.region}</p>
                      <div className="flex items-center gap-1 text-xs text-amber-600">
                        <Lock className="w-3 h-3" />
                        <span>Coming Soon</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {filteredLanguages.length === 0 && (
          <div className="text-center py-16">
            <p className="text-neutral-500">
              Tidak ada bahasa ditemukan untuk &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}

        <div className={`mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 transition-all duration-700 ${gridInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <p className="text-sm text-green-700 text-center font-medium">
            🌟 Kami terus menambahkan bahasa daerah baru. Pantau terus untuk update!
          </p>
        </div>
      </div>
    </div>
  );
}
