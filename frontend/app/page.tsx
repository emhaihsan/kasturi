import { HeroSection } from '@/components/landing/HeroSection';
import { AboutUsSection } from '@/components/landing/AboutUsSection';
import { CoursesSection } from '@/components/landing/CoursesSection';
import { WhyChooseUsSection } from '@/components/landing/WhyChooseUsSection';
import { LearningMethodSection } from '@/components/landing/LearningMethodSection';
import { TargetUsersSection } from '@/components/landing/TargetUsersSection';
import { FAQSection } from '@/components/landing/FAQSection';


export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutUsSection />
      <CoursesSection />
      <WhyChooseUsSection />
      <LearningMethodSection />
      <TargetUsersSection />
      <FAQSection />

    </main>
  );
}
