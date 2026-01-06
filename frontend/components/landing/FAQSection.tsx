'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type FaqItem = {
  q: string;
  a: string;
};

export function FAQSection() {
  const items = useMemo<FaqItem[]>(
    () => [
      {
        q: 'What is Kasturi?',
        a: 'Kasturi is a structured way to learn Indonesian regional languages. After completing a module, you can receive on-chain proof of completion (a non-transferable credential/SBT) that can be publicly verified.',
      },
      {
        q: 'Which languages are supported right now?',
        a: 'Currently, Banjar and Ambonese Malay are available. Content is organized into short, real conversation-based lessons.',
      },
      {
        q: 'What is EXP? Is it a token or money?',
        a: 'EXP is a learning progress signal. It is not a financial asset and is not meant for speculation. EXP is used to indicate completion eligibility and redemption access.',
      },
      {
        q: 'What is a non-transferable credential (SBT)?',
        a: 'An SBT credential is proof of completion that cannot be transferred. A user can hold a credential for a specific program/module, and its status can be checked publicly.',
      },
      {
        q: 'How can someone verify my completion?',
        a: 'Use the Verify page. Third parties do not need to log in to check completion status (completed / not completed).',
      },
      {
        q: 'What is stored on-chain vs off-chain?',
        a: 'On-chain stores publicly verifiable state: credential existence, EXP balance, and redemption state. Off-chain handles content, assessments, and deciding when a user is eligible for EXP/credentials.',
      },
      {
        q: 'What are utility rewards (vouchers)?',
        a: 'After completion, EXP can be used to redeem utility benefits (e.g., vouchers/merchandise access). Redemption is simple and the benefits are finite.',
      },
      {
        q: 'Do I need a wallet first?',
        a: 'Not necessarily. Login is simplified with Privy (email/social/wallet). Web3 complexity is hidden to keep the UX simple.',
      },
    ],
    []
  );

  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-block px-4 py-2 bg-neutral-100 rounded-full mb-6">
            <p className="text-sm text-neutral-600">FAQ</p>
          </div>
          <h2 className="text-4xl font-bold text-neutral-900 leading-tight">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-3xl mx-auto bg-neutral-50 rounded-3xl p-2">
          <div className="divide-y divide-neutral-200">
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
                    {isOpen && <p className="text-sm text-neutral-600 leading-relaxed mt-2">{item.a}</p>}
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
    </section>
  );
}
