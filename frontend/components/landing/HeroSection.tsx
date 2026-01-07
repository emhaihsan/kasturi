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
    <section ref={sectionRef} className="relative bg-white bg-dot-pattern-light pt-40 pb-20 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-emerald-50/20 animate-gradient" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-float-delayed" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
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

        <div className="relative">
          <div className="hidden md:flex items-center justify-between absolute inset-y-0 left-0 right-0 pointer-events-none z-10">
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
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none' }}
          >
            {slides.map((image, idx) => (
              <div
                key={idx}
                className="snap-center shrink-0 w-full md:w-[60%] aspect-[16/9] rounded-3xl overflow-hidden"
              >
                <img src={image} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
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
