'use client';

import {
  Award,
  BookOpen,
  ClipboardCheck,
  Gift,
  LineChart,
  ShieldCheck,
} from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const advantages = [
  {
    icon: BookOpen,
    title: 'Structured Learning',
    description:
      'Short, conversation-based lessons in a clear order—easy to follow without external guidance.',
  },
  {
    icon: LineChart,
    title: 'Progress Signal (EXP)',
    description:
      'EXP indicates learning progress and completion eligibility—it is not a financial asset.',
  },
  {
    icon: Award,
    title: 'Non-transferable Credential (SBT)',
    description:
      'After finishing a program, you receive on-chain proof of completion that cannot be transferred.',
  },
  {
    icon: ShieldCheck,
    title: 'Public Verification',
    description:
      'Third parties can verify completion without logging in and without relying on the platform operator.',
  },
  {
    icon: Gift,
    title: 'Utility Rewards (Vouchers)',
    description:
      'Completion unlocks the option to convert EXP into clear, finite utility benefits (e.g., vouchers).',
  },
  {
    icon: ClipboardCheck,
    title: 'Hidden Web3 Complexity',
    description:
      'Easy login via Privy (email/social/wallet). Blockchain runs quietly in the background.',
  },
];

export function WhyChooseUsSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="why-choose-us" className="py-20 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`bg-neutral-50 rounded-3xl px-6 py-14 sm:px-10 transition-all duration-700 ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-2 bg-white border border-neutral-200 rounded-full mb-6">
              <p className="text-sm text-neutral-600">Why choose us</p>
            </div>

            <h2 className="text-4xl font-bold text-neutral-900 leading-tight">
              Why Choose Kasturi
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-x-10 gap-y-12">
            {advantages.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index} 
                  className={`text-left transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-neutral-800" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
