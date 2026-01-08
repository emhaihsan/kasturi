'use client';

import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { usePrograms } from '@/lib/hooks/usePrograms';

export default function LanguagesPage() {
  const { ref: headerRef, isInView: headerInView } = useInView();
  const { ref: gridRef, isInView: gridInView } = useInView();
  const [searchQuery, setSearchQuery] = useState('');
  const { programs, loading } = usePrograms();

  const filteredPrograms = programs.filter(
    (prog) =>
      prog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10" ref={headerRef}>
          <h1 className={`text-3xl font-bold text-neutral-900 mb-2 transition-all duration-700 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Choose Language
          </h1>
          <p className={`text-neutral-500 transition-all duration-700 delay-100 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Start your Indonesian regional language learning journey
          </p>
        </div>

        <div className={`max-w-sm mb-8 transition-all duration-700 delay-200 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-neutral-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4" ref={gridRef}>
          {loading ? (
            <div className="col-span-2 text-center py-16 text-neutral-500">Loading programs...</div>
          ) : (
            filteredPrograms.map((program, idx) => (
              <Link key={program.id} href={`/languages/${program.id}`}>
                <div className={`group p-6 bg-white rounded-2xl border border-neutral-200 hover:border-green-500 hover:shadow-xl transition-all duration-500 ${gridInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${idx * 100}ms` }}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-2xl flex-shrink-0">
                      🏝️
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-neutral-900 mb-1">
                        {program.name}
                      </h2>
                      <p className="text-sm text-neutral-500 mb-3">{program.description || 'Kalimantan Selatan'}</p>
                      <div className="flex items-center gap-4 text-xs text-neutral-400">
                        <span>{program.lessons.length} Lessons</span>
                        <span>+{program.totalExp} EXP</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {!loading && filteredPrograms.length === 0 && (
          <div className="text-center py-16">
            <p className="text-neutral-500">
              No programs found for &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}

        <div className={`mt-12 p-6 bg-neutral-50 rounded-2xl transition-all duration-700 ${gridInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <p className="text-sm text-neutral-500 text-center">
            New languages coming soon: Javanese, Sundanese, Minang, and more
          </p>
        </div>
      </div>
    </div>
  );
}
