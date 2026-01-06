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
        title: 'Practice & evaluation to determine progress',
        description:
          'Complete multiple-choice exercises to test understanding. Progress determines EXP and completion eligibility (off-chain judgment, on-chain state).',
      },
      {
        title: 'Publicly verifiable proof of completion',
        description:
          'When you finish a module, you receive a non-transferable credential (SBT). Anyone can verify completion without logging in via the verification page.',
      },
    ],
    []
  );

  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section id="learning-method" className="py-20 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className={`aspect-[4/3] bg-neutral-200 rounded-3xl overflow-hidden flex items-center justify-center transition-all duration-700 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <MessageCircle className="w-20 h-20 text-neutral-400" />
          </div>

          <div className={`transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="inline-block px-4 py-2 bg-neutral-100 rounded-full mb-6">
              <p className="text-sm text-neutral-600">Learning method</p>
            </div>

            <h2 className="text-4xl font-bold text-neutral-900 leading-tight mb-4">
              How Kasturi Helps You
              <br />
              Speak Like a Local
            </h2>

            <p className="text-neutral-500 mb-10">
              The flow is simple: learn → practice → complete. Web3 runs in the background to make your completion proof credible.
            </p>

            <div className="divide-y divide-neutral-200 border-t border-neutral-200">
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
                        <p className="text-sm text-neutral-500 leading-relaxed mt-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-1 flex-shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-neutral-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-600" />
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
