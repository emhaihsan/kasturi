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
    <section id="courses" className="py-20 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-start justify-between gap-8 mb-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div>
            <div className="inline-block px-4 py-2 bg-neutral-100 rounded-full mb-5">
              <p className="text-sm text-neutral-600">Our courses</p>
            </div>

            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Available Courses</h2>
            <p className="text-neutral-500 max-w-xl">
              Start with our first two regional languages: Banjar and Ambon. Each module is built from short, conversation-based lessons.
            </p>
          </div>

          <Link
            href="/languages"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-full border border-neutral-200 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
          >
            Explore More
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {featured.map((lang, idx) => {
            const displayName = overrides[lang.id]?.name ?? lang.name;
            const displayDescription = overrides[lang.id]?.description ?? lang.description;
            return (
            <Link key={lang.id} href={`/languages/${lang.id}`} className={`group transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${idx * 150}ms` }}>
              <div>
                <div className="aspect-[16/10] bg-neutral-200 rounded-3xl overflow-hidden mb-6">
                  <img src={overrides[lang.id]?.image || ''} alt={displayName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>

                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{displayName}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2">
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
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-neutral-200 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
          >
            Explore More
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
