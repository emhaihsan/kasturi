'use client';

import { Target, Users, Award, Heart, Globe, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useInView } from '@/hooks/useInView';

export default function AboutPage() {
  const { ref: heroRef, isInView: heroInView } = useInView();
  const { ref: problemRef, isInView: problemInView } = useInView();
  const { ref: solutionRef, isInView: solutionInView } = useInView();
  const { ref: blockchainRef, isInView: blockchainInView } = useInView();
  const { ref: liskRef, isInView: liskInView } = useInView();
  const { ref: ctaRef, isInView: ctaInView } = useInView();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="relative bg-[var(--accent)] text-white py-20 overflow-hidden border-b-4 border-neutral-900" ref={heroRef}>
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_10%_20%,#ffd84d_0%,transparent_40%),radial-gradient(circle_at_80%_10%,#b5dcff_0%,transparent_38%)]" />
        <div className={`relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-700 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl sm:text-5xl font-black mb-6 uppercase">About Kasturi</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Indonesian regional language learning platform with verifiable on-chain certification
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="mb-16" ref={problemRef}>
          <h2 className={`text-3xl font-black text-neutral-900 mb-6 uppercase transition-all duration-700 ${problemInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>The Problem We Solve</h2>
          <div className={`prose prose-lg text-[var(--ink-muted)] max-w-none transition-all duration-700 delay-200 ${problemInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p>
              Indonesia has hundreds of regional languages still actively used in daily life. 
              However, there is no structured and credible way for newcomers to learn them.
            </p>
            <p>
              For <strong>migrants</strong>—students, workers, or families moving between regions—language barriers 
              often cause miscommunication, social friction, and difficulty integrating with local communities.
            </p>
            <p>
              Currently, learning regional languages depends on luck: having a local friend willing to teach, 
              living long enough in the area, or socially risky trial-and-error.
            </p>
          </div>
        </section>

        <section className="mb-16" ref={solutionRef}>
          <h2 className={`text-3xl font-black text-neutral-900 mb-6 uppercase transition-all duration-700 ${solutionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Kasturi Solution</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className={`transition-all duration-500 hover:-translate-y-1 delay-[100ms] ${solutionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-white neo-border neo-shadow-sm flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-neutral-900" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Structured Learning</h3>
                <p className="text-[var(--ink-muted)]">
                  Systematically organized modules based on real-life conversations, not grammar theory.
                </p>
              </CardContent>
            </Card>

            <Card className={`transition-all duration-500 hover:-translate-y-1 delay-[200ms] ${solutionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-white neo-border neo-shadow-sm flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-neutral-900" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Verified Certificate</h3>
                <p className="text-[var(--ink-muted)]">
                  Proof of completion is recorded on-chain and can be verified by anyone without logging in.
                </p>
              </CardContent>
            </Card>

            <Card className={`transition-all duration-500 hover:-translate-y-1 delay-[300ms] ${solutionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-white neo-border neo-shadow-sm flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-neutral-900" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Focus on Practice</h3>
                <p className="text-[var(--ink-muted)]">
                  Learn language that is actually used daily, not formal language rarely spoken.
                </p>
              </CardContent>
            </Card>

            <Card className={`transition-all duration-500 hover:-translate-y-1 delay-[400ms] ${solutionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-white neo-border neo-shadow-sm flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-neutral-900" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Reward System</h3>
                <p className="text-[var(--ink-muted)]">
                  Collect EXP from each lesson, exchange for tokens, and get vouchers or merchandise.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16" ref={blockchainRef}>
          <h2 className={`text-3xl font-black text-neutral-900 mb-6 uppercase transition-all duration-700 ${blockchainInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Why Blockchain?</h2>
          <Card className={`bg-white transition-all duration-700 delay-200 ${blockchainInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white neo-border neo-shadow-sm flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-neutral-900" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">Credibility Without Intermediaries</h3>
                  <p className="text-[var(--ink-muted)]">
                    Without blockchain, certificates only rely on trust in the platform. 
                    With blockchain, proof of completion is public, permanent, and can be verified 
                    by anyone without needing to trust Kasturi as a third party.
                  </p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-[var(--surface)] rounded-xl p-4 text-center neo-border">
                  <p className="text-2xl font-black text-neutral-900">100%</p>
                  <p className="text-sm text-[var(--ink-muted)]">Verified</p>
                </div>
                <div className="bg-[var(--surface)] rounded-xl p-4 text-center neo-border">
                  <p className="text-2xl font-black text-neutral-900">0</p>
                  <p className="text-sm text-[var(--ink-muted)]">Trust Required</p>
                </div>
                <div className="bg-[var(--surface)] rounded-xl p-4 text-center neo-border">
                  <p className="text-2xl font-black text-neutral-900">∞</p>
                  <p className="text-sm text-[var(--ink-muted)]">Proof Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16" ref={liskRef}>
          <h2 className={`text-3xl font-black text-neutral-900 mb-6 uppercase transition-all duration-700 ${liskInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Built for Lisk</h2>
          <div className={`prose prose-lg text-[var(--ink-muted)] max-w-none transition-all duration-700 delay-200 ${liskInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p>
              Kasturi is built on <strong>Lisk</strong>, an Ethereum Layer-2 designed for 
              low transaction costs, builder-friendly, and focused on high-growth markets including Southeast Asia.
            </p>
            <p>
              This project was developed as a submission for <strong>Lisk Builders Challenge Round 3</strong>, 
              an online hackathon emphasizing building <em>real ventures</em>, not just technical demos.
            </p>
          </div>
        </section>

        <section className="text-center" ref={ctaRef}>
          <div className={`inline-flex items-center gap-2 px-4 py-2 bg-white neo-pill text-neutral-900 text-sm font-semibold mb-6 transition-all duration-700 ${ctaInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <Sparkles className="w-4 h-4" />
            Ready to start?
          </div>
          <h2 className={`text-3xl font-black text-neutral-900 mb-4 uppercase transition-all duration-700 delay-100 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Start Learning Now</h2>
          <p className={`text-[var(--ink-muted)] mb-8 max-w-xl mx-auto transition-all duration-700 delay-200 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Choose a regional language and start your learning journey. Free, structured, and your learning proof will be stored forever.
          </p>
          <div className={`transition-all duration-700 delay-300 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Link href="/languages">
              <Button size="lg">
                Choose Language
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
