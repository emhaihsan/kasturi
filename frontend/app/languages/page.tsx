'use client';

import Link from 'next/link';
import { Search, ArrowRight, Clock, Lock } from 'lucide-react';
import { languages } from '@/lib/data';
import { useState, useEffect } from 'react';

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
    <div className="min-h-screen bg-[var(--background)] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-neutral-900 mb-2 uppercase">
            Choose a Regional Language
          </h1>
          <p className="text-[var(--ink-muted)]">
            Start your journey learning Indonesian regional languages
          </p>
        </div>

        <div className="max-w-sm mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-700" />
            <input
              type="text"
              placeholder="Search languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white neo-border neo-shadow-sm focus:outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Active Languages */}
        {activeLanguages.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Available Now</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {activeLanguages.map((language, idx) => (
                <Link key={language.id} href={`/languages/${language.id}`}>
                  <div className="group p-6 bg-white rounded-2xl neo-border neo-shadow-sm hover:-translate-y-1 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white neo-border neo-shadow-sm flex items-center justify-center text-2xl flex-shrink-0">
                        {language.flag}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="font-semibold text-neutral-900">
                            {language.name}
                          </h2>
                          <span className="px-2 py-0.5 bg-white neo-pill text-neutral-900 text-xs font-semibold">
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-[var(--ink-muted)] mb-3">{language.region}</p>
                        <div className="flex items-center gap-4 text-xs text-[var(--ink-muted)]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {language.totalLessons} Lessons
                          </span>
                          <span>{language.totalExp} EXP</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all flex-shrink-0" />
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
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Coming Soon</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comingSoonLanguages.map((language, idx) => (
                <div 
                  key={language.id} 
                  className="p-5 bg-[var(--surface)] rounded-2xl neo-border neo-shadow-sm opacity-70 cursor-not-allowed"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white neo-border neo-shadow-sm flex items-center justify-center text-xl flex-shrink-0 grayscale">
                      {language.flag}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-medium text-neutral-700 text-sm">
                          {language.name}
                        </h2>
                      </div>
                      <p className="text-xs text-[var(--ink-muted)] mb-2">{language.region}</p>
                      <div className="flex items-center gap-1 text-xs text-neutral-700">
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
            <p className="text-[var(--ink-muted)]">
              No languages found for &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}

        <div className="mt-12 p-6 bg-white rounded-2xl neo-border neo-shadow-sm">
          <p className="text-sm text-neutral-900 text-center font-semibold">
🌟 We continuously add new regional languages. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
}
