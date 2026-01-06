'use client';

import { Button } from '../ui/Button';
import Link from 'next/link';
import { Play } from 'lucide-react';

export function AboutUsSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-10">
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

        <div className="relative aspect-[16/7] bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-3xl overflow-hidden flex items-center justify-center">
          <button className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-lg">
            <Play className="w-6 h-6 text-neutral-900 fill-neutral-900" />
          </button>
        </div>
      </div>
    </section>
  );
}
