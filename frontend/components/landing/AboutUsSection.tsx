'use client';

import { Button } from '../ui/Button';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

export function AboutUsSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="about" className="py-20 bg-[var(--background)]" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-12 items-start mb-10 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white neo-pill mb-6">
              <span className="inline-block w-3 h-3 rounded-sm bg-[var(--accent)]" />
              <p className="text-sm font-semibold text-neutral-900">About us</p>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-neutral-900 leading-tight uppercase">
              Learn Regional Languages
              <br />
              With Trusted Certificates
            </h2>
          </div>

          <div className="lg:pt-12">
            <p className="text-lg text-[var(--ink-muted)] leading-relaxed mb-8">
              Learn regional languages with structured, conversation-based lessons. Get certificates that prove your language skills and can be verified by anyone, anywhere.
            </p>

            <Link href="/about">
              <Button size="lg">Learn More</Button>
            </Link>
          </div>
        </div>

        <div className={`relative aspect-[16/7] bg-white rounded-3xl overflow-hidden neo-border neo-shadow transition-all duration-700 delay-300 ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <img src="/aboutimage.webp" alt="About Kasturi" className="w-full h-full object-cover" />
      
        </div>
      </div>
    </section>
  );
}
