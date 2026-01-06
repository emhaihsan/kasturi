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
    <section id="target-users" className="py-20 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-14 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block px-4 py-2 bg-neutral-100 rounded-full mb-6">
            <p className="text-sm text-neutral-600">Who is it for?</p>
          </div>

          <h2 className="text-4xl font-bold text-neutral-900 leading-tight">
            Who Benefits Most
            <br />
            From Kasturi?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Row 1: image - text - image */}
          <div className={`bg-neutral-100 rounded-3xl overflow-hidden aspect-[4/3] flex items-center justify-center transition-all duration-500 hover:scale-105 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
            <GraduationCap className="w-16 h-16 text-neutral-400" />
          </div>

          <div className={`bg-neutral-50 rounded-3xl p-8 flex items-center justify-center text-center transition-all duration-500 hover:shadow-lg ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">{personas[0].title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{personas[0].description}</p>
            </div>
          </div>

          <div className={`bg-neutral-100 rounded-3xl overflow-hidden aspect-[4/3] flex items-center justify-center transition-all duration-500 hover:scale-105 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
            <Briefcase className="w-16 h-16 text-neutral-400" />
          </div>

          {/* Row 2: text - image - text */}
          <div className={`bg-neutral-50 rounded-3xl p-8 flex items-center justify-center text-center transition-all duration-500 hover:shadow-lg ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">{personas[1].title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{personas[1].description}</p>
            </div>
          </div>

          <div className={`bg-neutral-100 rounded-3xl overflow-hidden aspect-[4/3] flex items-center justify-center transition-all duration-500 hover:scale-105 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '500ms' }}>
            <Globe className="w-16 h-16 text-neutral-400" />
          </div>

          <div className={`bg-neutral-50 rounded-3xl p-8 flex items-center justify-center text-center transition-all duration-500 hover:shadow-lg ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">{personas[2].title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{personas[2].description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
