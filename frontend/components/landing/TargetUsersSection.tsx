'use client';

import { Briefcase, GraduationCap, Globe } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const personas = [
  {
    title: 'Students studying in a new city',
    description:
      'Adapt faster in your new environment—from greetings and daily conversations to commonly used local context.',
    icon: GraduationCap,
  },
  {
    title: 'Working professionals',
    description:
      'Communicate more naturally with local colleagues and clients. Ideal if you frequently relocate for work.',
    icon: Briefcase,
  },
  {
    title: 'International travelers',
    description:
      'Learn practical phrases for everyday travel. Interact more easily and show respect for local culture.',
    icon: Globe,
  },
];

export function TargetUsersSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="target-users" className="py-20 bg-[var(--background)]" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-14 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white neo-pill mb-6">
            <span className="inline-block w-3 h-3 rounded-sm bg-[var(--accent)]" />
            <p className="text-sm font-semibold text-neutral-900">Who is it for?</p>
          </div>

          <h2 className="text-4xl font-black text-neutral-900 leading-tight uppercase">
            Who Benefits Most
            <br />
            From Kasturi?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Row 1: image - text - image */}
          <div className={`bg-white rounded-3xl overflow-hidden aspect-[4/3] neo-border neo-shadow transition-all duration-500 hover:-translate-y-1 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
            <img src="/professional.webp" alt="Students studying in a new city" className="w-full h-full object-cover" />
          </div>

          <div className={`bg-[var(--surface)] rounded-3xl p-8 flex items-center justify-center text-center neo-border neo-shadow transition-all duration-500 hover:-translate-y-1 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">{personas[0].title}</h3>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">{personas[0].description}</p>
            </div>
          </div>

          <div className={`bg-white rounded-3xl overflow-hidden aspect-[4/3] neo-border neo-shadow transition-all duration-500 hover:-translate-y-1 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
            <img src="/bule-pasar.webp" alt="Working professionals" className="w-full h-full object-cover" />
          </div>

          {/* Row 2: text - image - text */}
          <div className={`bg-[var(--surface)] rounded-3xl p-8 flex items-center justify-center text-center neo-border neo-shadow transition-all duration-500 hover:-translate-y-1 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">{personas[1].title}</h3>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">{personas[1].description}</p>
            </div>
          </div>

          <div className={`bg-white rounded-3xl overflow-hidden aspect-[4/3] neo-border neo-shadow transition-all duration-500 hover:-translate-y-1 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '500ms' }}>
            <img src="/lokal.webp" alt="International travelers" className="w-full h-full object-cover" />
          </div>

          <div className={`bg-[var(--surface)] rounded-3xl p-8 flex items-center justify-center text-center neo-border neo-shadow transition-all duration-500 hover:-translate-y-1 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">{personas[2].title}</h3>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">{personas[2].description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
