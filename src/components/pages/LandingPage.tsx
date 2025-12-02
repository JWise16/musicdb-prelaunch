/**
 * Landing Page - Unified Marketing Page
 * Composes all sections with comprehensive content from MVP
 */

import { LandingHeader } from '../landing/LandingHeader';
import { LandingHeroSection } from '../landing/LandingHeroSection';
import { LandingUseCasesSection } from '../landing/LandingUseCasesSection';
import { LandingPricingSection } from '../landing/LandingPricingSection';
import { LandingFaqSection } from '../landing/LandingFaqSection';
import { LandingFooterSection } from '../landing/LandingFooterSection';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <LandingHeader />

      {/* Hero Section */}
      <LandingHeroSection />

      {/* Use Cases / Features Section */}
      <LandingUseCasesSection />

      {/* Pricing Section */}
      <LandingPricingSection />

      {/* FAQ Section */}
      <LandingFaqSection />

      {/* Footer */}
      <LandingFooterSection />
    </div>
  );
}
