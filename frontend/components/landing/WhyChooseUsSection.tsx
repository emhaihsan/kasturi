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
    title: 'Easy to Follow',
    description:
      'Short, conversation-based lessons in a clear order—learn at your own pace without confusion.',
  },
  {
    icon: LineChart,
    title: 'Track Your Progress',
    description:
      'See your learning journey with points that show how far you\'ve come and what\'s next.',
  },
  {
    icon: Award,
    title: 'Get Certificates',
    description:
      'Earn certificates after completing lessons that prove your language skills.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted & Secure',
    description:
      'Your certificates can be verified by anyone, anytime—no need to contact us.',
  },
  {
    icon: Gift,
    title: 'Earn Rewards',
    description:
      'Exchange your points for vouchers and other rewards as you complete lessons.',
  },
  {
    icon: ClipboardCheck,
    title: 'Simple Login',
    description:
      'Sign in easily with email, Google, or Twitter—no complicated setup required.',
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
