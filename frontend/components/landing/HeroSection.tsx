'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function HeroSection() {
  const { login, authenticated } = usePrivy();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(true);
  const [isAutoSliding, setIsAutoSliding] = useState(false);
  const [isPageScrolling, setIsPageScrolling] = useState(false);

  const slides = [
    '/hero1.webp',
    '/hero2.webp',
    '/hero3.webp',
    '/hero4.webp',
    '/hero5.webp',
    '/hero6.webp',
    '/hero7.webp',
  ];

  const scrollToIndex = (idx: number, auto = false) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(slides.length - 1, idx));
    const child = el.children.item(clamped) as HTMLElement | null;
    if (!child) return;
    
    if (auto) {
      setIsAutoSliding(true);
    }
    
    // Use scrollLeft instead of scrollIntoView to prevent page scroll jump
    const scrollLeft = child.offsetLeft - (el.clientWidth / 2) + (child.clientWidth / 2);
    el.scrollTo({ left: scrollLeft, behavior: 'smooth' });
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
    setIsAutoSliding(false);
  };

  // Intersection Observer to detect when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Detect page scroll to pause auto-slide
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handlePageScroll = () => {
      setIsPageScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsPageScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handlePageScroll);
    return () => {
      window.removeEventListener('scroll', handlePageScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Auto-slide every 4 seconds, only when in view and not page scrolling
  useEffect(() => {
    if (!isInView || isPageScrolling) return;

    const interval = setInterval(() => {
      if (!isAutoSliding) {
        const nextIndex = (activeIndex + 1) % slides.length;
        scrollToIndex(nextIndex, true);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex, slides.length, isInView, isAutoSliding, isPageScrolling]);

  return (
    <section ref={sectionRef} className="relative bg-[var(--background)] bg-dot-pattern pt-40 pb-24 overflow-hidden">
      <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_10%_20%,#ffd84d_0%,transparent_40%),radial-gradient(circle_at_80%_10%,#b5dcff_0%,transparent_38%),radial-gradient(circle_at_80%_80%,#ff7a00_0%,transparent_40%)]" />
      <div className="absolute top-16 right-16 w-40 h-40 bg-[var(--highlight)] rounded-[28%] neo-border-thick rotate-6 animate-float" />
      <div className="absolute bottom-24 left-14 w-28 h-28 bg-[var(--accent-soft)] rounded-[24%] neo-border-thick -rotate-6 animate-float-delayed" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white neo-pill mb-6">
            <span className="inline-block w-3 h-3 rounded-sm bg-[var(--accent)]" />
            <p className="text-sm font-semibold text-neutral-900">Learn Indonesian Regional Languages</p>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-neutral-900 leading-tight mb-6 uppercase">
            Speak Like
            <br />
            A Local
          </h1>
          
          <p className="text-lg text-[var(--ink-muted)] mb-10 max-w-2xl mx-auto leading-relaxed">
            Learn regional languages through short, practical lessons. Track your progress, earn certificates, and prove your language skills to anyone.
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
                Verify Certificate
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="hidden md:flex items-center justify-between absolute inset-y-0 left-0 right-0 pointer-events-none z-10">
            <div className="pointer-events-auto">
              <button
                type="button"
                onClick={() => scrollToIndex(activeIndex - 1)}
                className="w-10 h-10 rounded-full bg-white neo-border neo-shadow-sm flex items-center justify-center hover:-translate-y-0.5 transition-transform"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-700" />
              </button>
            </div>
            <div className="pointer-events-auto">
              <button
                type="button"
                onClick={() => scrollToIndex(activeIndex + 1)}
                className="w-10 h-10 rounded-full bg-white neo-border neo-shadow-sm flex items-center justify-center hover:-translate-y-0.5 transition-transform"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 text-neutral-700" />
              </button>
            </div>
          </div>

          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none' }}
          >
            {slides.map((image, idx) => (
              <div
                key={idx}
                className="snap-center shrink-0 w-full md:w-[60%] aspect-[16/9] rounded-3xl overflow-hidden neo-border neo-shadow"
              >
                <img src={image} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToIndex(idx)}
                className={`h-2 rounded-full transition-all ${idx === activeIndex ? 'w-8 bg-neutral-900' : 'w-2 bg-neutral-400'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
