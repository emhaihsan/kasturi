'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { Award, BookOpen, ChevronLeft, ChevronRight, GraduationCap, Users } from 'lucide-react';

export function HeroSection() {
  const { login, authenticated } = usePrivy();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = useMemo(
    () => [
      { id: 's1', Icon: BookOpen, label: 'Lessons' },
      { id: 's2', Icon: Users, label: 'Conversations' },
      { id: 's3', Icon: GraduationCap, label: 'Practice' },
      { id: 's4', Icon: Award, label: 'Credential' },
    ],
    []
  );

  const scrollToIndex = (idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(slides.length - 1, idx));
    const child = el.children.item(clamped) as HTMLElement | null;
    if (!child) return;
    child.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    setActiveIndex(clamped);
  };

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) return;
    const center = el.scrollLeft + el.clientWidth / 2;

    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < children.length; i++) {
      const c = children[i];
      const cCenter = c.offsetLeft + c.clientWidth / 2;
      const dist = Math.abs(center - cCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    setActiveIndex(bestIdx);
  };

  return (
    <section className="bg-white pt-40 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-neutral-100 rounded-full mb-6">
            <p className="text-sm text-neutral-600">Structured learning • On-chain proof</p>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 leading-tight mb-6">
            Speak Like
            <br />
            a Local
          </h1>
          
          <p className="text-lg text-neutral-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Kasturi helps newcomers learn regional languages through short, conversation-based lessons. Complete a module, earn EXP as a progress signal, and receive a non-transferable credential (SBT) that anyone can publicly verify.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            {authenticated ? (
              <Link href="/languages">
                <Button size="lg">
                  Explore Lessons
                </Button>
              </Link>
            ) : (
              <Button size="lg" onClick={() => login()}>
                Get Started
              </Button>
            )}
            <Link href="/verify">
              <Button variant="outline" size="lg">
                Verify Credential
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 relative">
          <div className="hidden md:flex items-center justify-between absolute inset-y-0 left-0 right-0 pointer-events-none">
            <div className="pointer-events-auto">
              <button
                type="button"
                onClick={() => scrollToIndex(activeIndex - 1)}
                className="w-10 h-10 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center hover:bg-neutral-50 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-700" />
              </button>
            </div>
            <div className="pointer-events-auto">
              <button
                type="button"
                onClick={() => scrollToIndex(activeIndex + 1)}
                className="w-10 h-10 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center hover:bg-neutral-50 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 text-neutral-700" />
              </button>
            </div>
          </div>

          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-4 px-4"
            style={{ scrollbarWidth: 'none' }}
          >
            {slides.map(({ id, Icon, label }) => (
              <div
                key={id}
                className="snap-center shrink-0 w-[70%] sm:w-[45%] md:w-[24%] aspect-[3/4] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl overflow-hidden flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-shadow"
              >
                <Icon className="w-16 h-16 text-neutral-400" />
                <p className="text-sm text-neutral-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToIndex(idx)}
                className={`h-2 rounded-full transition-all ${idx === activeIndex ? 'w-6 bg-neutral-900' : 'w-2 bg-neutral-300'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
