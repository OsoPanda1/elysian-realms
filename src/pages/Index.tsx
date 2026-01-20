import { Navigation } from '@/components/layout/Navigation';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { IsabellaSection } from '@/components/sections/IsabellaSection';
import { MarketplaceSection } from '@/components/sections/MarketplaceSection';
import { MissionsSection } from '@/components/sections/MissionsSection';
import { FooterSection } from '@/components/sections/FooterSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <IsabellaSection />
        <MarketplaceSection />
        <MissionsSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
