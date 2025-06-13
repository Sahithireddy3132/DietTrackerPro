import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/sections/HeroSection';
import { DietSection } from '@/components/sections/DietSection';
import { WorkoutSection } from '@/components/sections/WorkoutSection';
import { ProgressSection } from '@/components/sections/ProgressSection';
import { ChatbotSection } from '@/components/sections/ChatbotSection';
import { GymLocatorSection } from '@/components/sections/GymLocatorSection';
import { GoalsSection } from '@/components/sections/GoalsSection';
import { Footer } from '@/components/sections/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen dark-bg text-white overflow-x-hidden">
      <Navigation />
      
      <main>
        <HeroSection />
        <DietSection />
        <WorkoutSection />
        <ProgressSection />
        <ChatbotSection />
        <GymLocatorSection />
        <GoalsSection />
      </main>
      
      <Footer />
    </div>
  );
}
