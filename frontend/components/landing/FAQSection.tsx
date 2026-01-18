'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

type FaqItem = {
  q: string;
  a: string;
};

export function FAQSection() {
  const { ref, isInView } = useInView();
  const items = useMemo<FaqItem[]>(
    () => [
      {
        q: 'What is Kasturi?',
        a: 'Kasturi is a platform to learn Indonesian regional languages through structured lessons. After completing a module, you receive a certificate that can be verified by anyone.',
      },
      {
        q: 'Which languages are available?',
        a: 'Currently, Banjar and Ambonese Malay are available. Content is organized into short, conversation-based lessons.',
      },
      {
        q: 'How do I track my progress?',
        a: 'You earn points as you complete lessons. These points show your learning progress and unlock rewards when you finish modules.',
      },
      {
        q: 'What are certificates?',
        a: 'Certificates are proof that you completed a language module. They are permanent and can be verified by anyone using our verification page.',
      },
      {
        q: 'How can someone verify my certificate?',
        a: 'Use the Verify page on our website. Anyone can check your certificate status without needing to create an account.',
      },
      {
        q: 'What rewards can I get?',
        a: 'After completing lessons, you can exchange your points for vouchers and other benefits.',
      },
      {
        q: 'Do I need special software to use Kasturi?',
        a: 'No. Just sign in with your email, Google, or Twitter account. Everything works in your web browser.',
      },
    ],
    []
  );

  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section id="faq" className="py-20 bg-[var(--background)]" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-14 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white neo-pill mb-6">
            <span className="inline-block w-3 h-3 rounded-sm bg-[var(--accent)]" />
            <p className="text-sm font-semibold text-neutral-900">FAQ</p>
          </div>
          <h2 className="text-4xl font-black text-neutral-900 leading-tight uppercase">Frequently Asked Questions</h2>
        </div>

        <div className={`max-w-3xl mx-auto bg-[var(--surface)] rounded-3xl p-2 neo-border neo-shadow transition-all duration-700 delay-200 ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="divide-y divide-neutral-900/20">
            {items.map((item, idx) => {
              const isOpen = idx === openIndex;
              return (
                <button
                  key={item.q}
                  type="button"
                  className="w-full text-left p-6 flex items-start justify-between gap-6"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                >
                  <div>
                    <p className="font-semibold text-neutral-900">{item.q}</p>
                    {isOpen && <p className="text-sm text-[var(--ink-muted)] leading-relaxed mt-2">{item.a}</p>}
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
    </section>
  );
}
