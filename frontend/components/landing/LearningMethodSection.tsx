'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

type MethodItem = {
  title: string;
  description: string;
};

export function LearningMethodSection() {
  const { ref, isInView } = useInView();
  const items = useMemo<MethodItem[]>(
    () => [
      {
        title: 'Short, conversation-based lessons',
        description:
          'Learn through real scenarios (greetings, markets, directions) in a clear sequence. Focus on practical usage, not excessive theory.',
      },
      {
        title: 'Practice with quizzes',
        description:
          'Complete multiple-choice exercises to test your understanding. Your progress determines when you can move to the next level.',
      },
      {
        title: 'Get verified certificates',
        description:
          'When you finish a module, you receive a certificate. Anyone can verify your certificate without logging in via our verification page.',
      },
    ],
    []
  );

  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section id="learning-method" className="py-20 bg-[var(--background)]" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className={`aspect-[4/3] bg-white rounded-3xl overflow-hidden neo-border neo-shadow transition-all duration-700 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <img src="/howtospeak.webp" alt="Learning method" className="w-full h-full object-cover" />
          </div>

          <div className={`transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white neo-pill mb-6">
              <span className="inline-block w-3 h-3 rounded-sm bg-[var(--accent)]" />
              <p className="text-sm font-semibold text-neutral-900">Learning method</p>
            </div>

            <h2 className="text-4xl font-black text-neutral-900 leading-tight mb-4 uppercase">
              How Kasturi Helps You
              <br />
              Speak Like a Local
            </h2>

            <p className="text-[var(--ink-muted)] mb-10">
              The flow is simple: learn → practice → complete. Get certificates that prove your skills.
            </p>

            <div className="divide-y divide-neutral-900/20 border-t border-neutral-900/40">
              {items.map((item, idx) => {
                const isOpen = idx === openIndex;
                return (
                  <button
                    key={item.title}
                    type="button"
                    className="w-full text-left py-5 flex items-start justify-between gap-6"
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  >
                    <div>
                      <p className="font-semibold text-neutral-900">{item.title}</p>
                      {isOpen && (
                        <p className="text-sm text-[var(--ink-muted)] leading-relaxed mt-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-1 flex-shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-neutral-900" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-900" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
