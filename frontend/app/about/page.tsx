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
    <div className="min-h-screen bg-white">
      <div className="relative bg-gradient-to-br from-neutral-900 to-neutral-800 text-white py-20 overflow-hidden" ref={heroRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/5 animate-gradient" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-float" />
        <div className={`relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-700 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">About Kasturi</h1>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
            Indonesian regional language learning platform with verifiable on-chain certification
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="mb-16" ref={problemRef}>
          <h2 className={`text-3xl font-bold text-neutral-900 mb-6 transition-all duration-700 ${problemInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>The Problem We Solve</h2>
          <div className={`prose prose-lg text-neutral-600 max-w-none transition-all duration-700 delay-200 ${problemInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
          <h2 className={`text-3xl font-bold text-neutral-900 mb-6 transition-all duration-700 ${solutionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Kasturi Solution</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className={`transition-all duration-500 hover:shadow-xl delay-[100ms] ${solutionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Structured Learning</h3>
                <p className="text-neutral-600">
                  Systematically organized modules based on real-life conversations, not grammar theory.
                </p>
              </CardContent>
            </Card>

            <Card className={`transition-all duration-500 hover:shadow-xl delay-[200ms] ${solutionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Verified Certificate</h3>
                <p className="text-neutral-600">
                  Proof of completion is recorded on-chain and can be verified by anyone without logging in.
                </p>
              </CardContent>
            </Card>

            <Card className={`transition-all duration-500 hover:shadow-xl delay-[300ms] ${solutionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-neutral-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Focus on Practice</h3>
                <p className="text-neutral-600">
                  Learn language that is actually used daily, not formal language rarely spoken.
                </p>
              </CardContent>
            </Card>

            <Card className={`transition-all duration-500 hover:shadow-xl delay-[400ms] ${solutionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-neutral-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Reward System</h3>
                <p className="text-neutral-600">
                  Collect EXP from each lesson, exchange for tokens, and get vouchers or merchandise.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16" ref={blockchainRef}>
          <h2 className={`text-3xl font-bold text-neutral-900 mb-6 transition-all duration-700 ${blockchainInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Why Blockchain?</h2>
          <Card className={`bg-gradient-to-br from-green-50 to-neutral-50 border-green-200 transition-all duration-700 delay-200 ${blockchainInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">Credibility Without Intermediaries</h3>
                  <p className="text-neutral-600">
                    Without blockchain, certificates only rely on trust in the platform. 
                    With blockchain, proof of completion is public, permanent, and can be verified 
                    by anyone without needing to trust Kasturi as a third party.
                  </p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">100%</p>
                  <p className="text-sm text-neutral-500">Verified</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">0</p>
                  <p className="text-sm text-neutral-500">Trust Required</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">∞</p>
                  <p className="text-sm text-neutral-500">Proof Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16" ref={liskRef}>
          <h2 className={`text-3xl font-bold text-neutral-900 mb-6 transition-all duration-700 ${liskInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Built for Lisk</h2>
          <div className={`prose prose-lg text-neutral-600 max-w-none transition-all duration-700 delay-200 ${liskInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
          <div className={`inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-6 transition-all duration-700 ${ctaInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <Sparkles className="w-4 h-4" />
            Ready to start?
          </div>
          <h2 className={`text-3xl font-bold text-neutral-900 mb-4 transition-all duration-700 delay-100 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Start Learning Now</h2>
          <p className={`text-neutral-600 mb-8 max-w-xl mx-auto transition-all duration-700 delay-200 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
