'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { languages } from '@/lib/data';
import { useInView } from '@/hooks/useInView';

export function CoursesSection() {
  const { ref, isInView } = useInView();
  const featured = languages.filter((l) => l.id === 'banjar' || l.id === 'ambon');

  const overrides: Record<string, { name: string; description: string; image: string }> = {
    banjar: {
      name: 'Bahasa Banjar',
      description:
        'Learn everyday Banjar phrases for real-life conversations in South Kalimantan—greetings, introductions, and practical situations.',
      image: '/bekantan.webp',
    },
    ambon: {
      name: 'Bahasa Ambon',
      description:
        'Learn practical Ambonese used across Maluku—useful phrases and context to communicate more naturally with locals.',
      image: '/ambon.webp',
    },
  };

  return (
    <section id="courses" className="py-20 bg-[var(--background)]" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-start justify-between gap-8 mb-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white neo-pill mb-5">
              <span className="inline-block w-3 h-3 rounded-sm bg-[var(--accent)]" />
              <p className="text-sm font-semibold text-neutral-900">Our courses</p>
            </div>

            <h2 className="text-4xl font-black text-neutral-900 mb-4 uppercase">Available Courses</h2>
            <p className="text-[var(--ink-muted)] max-w-xl">
              Start with our first two regional languages: Banjar and Ambon. Each module is built from short, conversation-based lessons.
            </p>
          </div>

          <Link
            href="/languages"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-full neo-border neo-shadow-sm bg-white text-sm font-semibold text-neutral-900 hover:-translate-y-0.5 transition-transform"
          >
            Explore More
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {featured.map((lang, idx) => {
            const displayName = overrides[lang.id]?.name ?? lang.name;
            const displayDescription = overrides[lang.id]?.description ?? lang.description;
            const isComingSoon = lang.comingSoon;

            return (
              <Link
                key={lang.id}
                href={isComingSoon ? '#' : `/languages/${lang.id}`}
                className={`group transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${
                  isComingSoon ? 'cursor-not-allowed' : ''
                }`}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <div className="relative">
                  <div className="relative aspect-[16/10] bg-white rounded-3xl overflow-hidden mb-6 neo-border neo-shadow">
                    <img
                      src={overrides[lang.id]?.image || ''}
                      alt={displayName}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        isComingSoon ? 'brightness-50 group-hover:scale-100' : 'group-hover:scale-105'
                      }`}
                    />
                    {isComingSoon && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <span className="px-4 py-2 bg-white neo-pill text-xs font-semibold uppercase tracking-wide">
                          Coming Soon
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">{displayName}</h3>
                  <p className="text-sm text-[var(--ink-muted)] leading-relaxed line-clamp-2">
                    {displayDescription}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 sm:hidden">
          <Link
            href="/languages"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full neo-border neo-shadow-sm bg-white text-sm font-semibold text-neutral-900 hover:-translate-y-0.5 transition-transform"
          >
            Explore More
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
