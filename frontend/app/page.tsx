import { HeroSection } from '@/components/landing/HeroSection';
import { AboutUsSection } from '@/components/landing/AboutUsSection';
import { CoursesSection } from '@/components/landing/CoursesSection';


export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutUsSection />
      <CoursesSection />

    </main>
  );
}
