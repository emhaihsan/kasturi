'use client';

import { Button } from '../ui/Button';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

export function AboutUsSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="about" className="py-20 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-12 items-start mb-10 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div>
            <div className="inline-block px-4 py-2 bg-neutral-100 rounded-full mb-6">
              <p className="text-sm text-neutral-600">About us</p>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 leading-tight">
              Learn Regional Languages
              <br />
              With Verifiable Proof
            </h2>
          </div>

          <div className="lg:pt-12">
            <p className="text-lg text-neutral-600 leading-relaxed mb-8">
              Kasturi solves the problem of unstructured learning with no credible proof. We combine practical, conversation-based lessons with a non-transferable credential (SBT) that can be publicly verified.
            </p>

            <Link href="/about">
              <Button size="lg">Learn More</Button>
            </Link>
          </div>
        </div>

        <div className={`relative aspect-[16/7] bg-neutral-200 rounded-3xl overflow-hidden transition-all duration-700 delay-300 ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <img src="/aboutimage.webp" alt="About Kasturi" className="w-full h-full object-cover" />
      
        </div>
      </div>
    </section>
  );
}
