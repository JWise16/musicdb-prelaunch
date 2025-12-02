/**
 * Landing Page Pricing Section
 * Three pricing tiers with Contact Us CTAs
 */

import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface PricingTier {
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  description: string;
  buttonText: string;
  highlighted?: boolean;
  badge?: string;
}

const PricingCard = ({ tier, index }: { tier: PricingTier; index: number }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const isHighlighted = tier.highlighted;

  // Determine order: Mobile - Founding Customer first, Desktop - Founding Customer in middle
  let orderClass = '';
  if (tier.name === 'Founding Customer') {
    orderClass = 'order-first md:order-2';
  } else if (tier.name === 'Pro') {
    orderClass = 'order-2 md:order-1';
  } else if (tier.name === 'Premium') {
    orderClass = 'order-3 md:order-3';
  }

  const handleContactUs = () => {
    window.location.href = 'mailto:sam@musicdb.live?subject=MusicDB Pricing Inquiry';
  };

  return (
    <div
      ref={ref}
      className={`relative flex-1 transition-all duration-700 ease-out ${orderClass} ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {tier.badge && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
            {tier.badge}
          </span>
        </div>
      )}
      
      <div
        className={`h-full rounded-2xl p-6 md:p-8 lg:p-10 transition-all duration-300 flex flex-col ${
          isHighlighted
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl hover:shadow-blue-500/50 md:scale-105'
            : 'bg-white text-black shadow-2xl hover:shadow-xl'
        } hover:-translate-y-2`}
      >
        {/* Content Section - Grows to push button down */}
        <div className="flex-grow text-center">
          {/* Plan Name */}
          <h3 className={`text-2xl lg:text-3xl font-bold mb-6 ${
            isHighlighted ? 'text-white' : 'text-black'
          }`}>
            {tier.name}
          </h3>

          {/* Pricing */}
          <div className="mb-6">
            {tier.originalPrice && (
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className={`text-2xl line-through ${
                  isHighlighted ? 'text-blue-200' : 'text-gray-400'
                }`}>
                  ${tier.originalPrice}
                </span>
              </div>
            )}
            <div className="flex items-baseline justify-center gap-1">
              <span className={`text-5xl lg:text-6xl font-bold ${
                isHighlighted ? 'text-white' : 'text-black'
              }`}>
                ${tier.price}
              </span>
            </div>
            <p className={`text-sm uppercase tracking-wide mt-2 ${
              isHighlighted ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {tier.period}
            </p>
          </div>

          {/* Description */}
          <p className={`text-lg leading-relaxed mb-8 whitespace-pre-line ${
            isHighlighted ? 'text-blue-50' : 'text-gray-700'
          }`}>
            {tier.description}
          </p>
        </div>

        {/* CTA Button - Stays at bottom */}
        <button
          onClick={handleContactUs}
          className={`w-full py-3.5 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
            isHighlighted
              ? 'bg-white text-blue-700 hover:bg-blue-50 hover:shadow-lg'
              : 'bg-black text-white hover:bg-gray-800 hover:shadow-lg'
          } transform hover:scale-105`}
        >
          {tier.buttonText}
        </button>
      </div>
    </div>
  );
};

export const LandingPricingSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.3 });

  const pricingTiers: PricingTier[] = [
    {
      name: 'Founding Customer',
      price: '15',
      originalPrice: '85',
      period: 'USD Per Month',
      description: 'All features. Unlimited users.\nNo catch.',
      buttonText: 'Get in Touch',
      highlighted: true,
      badge: 'BEST VALUE'
    },
    {
      name: 'Pro',
      price: '50',
      period: 'USD Per Month',
      description: 'For artist analytics, show map, & show swap. Unlimited users.',
      buttonText: 'Contact Us',
      highlighted: false
    },
    {
      name: 'Premium',
      price: '85',
      period: 'USD Per Month',
      description: 'All features. Unlimited users.',
      buttonText: 'Contact Us',
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center mb-12 lg:mb-16 transition-all duration-700 ease-out ${
            headerVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto">
            Join the first wave of venues transforming their booking workflow
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-10 max-w-7xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <PricingCard key={tier.name} tier={tier} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

