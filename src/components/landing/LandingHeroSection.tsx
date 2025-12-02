/**
 * Landing Page Hero Section
 * Hero with headline, subheadline, musical notes, and artist grid
 */

import musicNotesImage from '../../assets/music-notes.png';
import { InfiniteScrollBelt } from './InfiniteScrollBelt';

// Import artist images
import artist1 from '../../assets/landing/artist-images/image 170.webp';
import artist2 from '../../assets/landing/artist-images/image 171.webp';
import artist3 from '../../assets/landing/artist-images/image 172.webp';
import artist4 from '../../assets/landing/artist-images/image 174.webp';
import artist5 from '../../assets/landing/artist-images/image 176.webp';
import artist6 from '../../assets/landing/artist-images/image 177 (1).webp';
import artist7 from '../../assets/landing/artist-images/image 178.webp';
import artist8 from '../../assets/landing/artist-images/image 254.webp';
import artist9 from '../../assets/landing/artist-images/image 255.webp';
import artist10 from '../../assets/landing/artist-images/Rectangle 1237.webp';

export const LandingHeroSection = () => {
  // Split images into two belts for visual variety
  const beltOneImages = [artist1, artist2, artist3, artist4, artist5];
  const beltTwoImages = [artist6, artist7, artist8, artist9, artist10];
  return (
    <section id="hero" className="pt-12 md:pt-20 lg:pt-18 pb-8 md:pb-12 lg:pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Hero Headline & Subheadline */}
        <div className="text-center mb-6 md:mb-10 lg:mb-14">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-3 md:mb-5 leading-tight max-w-6xl mx-auto px-4 animate-[fadeInUp_0.6s_ease-out]">
            The Single Source of Truth for <em className="font-bold italic">Talent Buyers</em>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-black max-w-5xl mx-auto leading-relaxed px-4 animate-[fadeInUp_0.6s_ease-out_0.15s_both]">
            MusicDB saves venues <strong className="font-semibold">time & money</strong> by automating the busywork of booking shows so talent buyers can focus on <strong className="font-semibold">creating great experiences.</strong>
          </p>
        </div>

        {/* Musical Notes Decoration - Hidden on small screens, visible from md up */}
        <div className="hidden sm:flex justify-center mb-6 md:mb-10 lg:mb-14 px-4 animate-[fadeIn_0.6s_ease-out_0.3s_both]">
          <img 
            src={musicNotesImage} 
            alt="Musical notes decoration" 
            className="w-full max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl h-auto object-contain opacity-30"
          />
        </div>

        {/* Artist Image Rotating Belts */}
        <div className="space-y-4 md:space-y-6 lg:space-y-8">
          {/* Belt 1 - Scrolling Left */}
          <InfiniteScrollBelt 
            images={beltOneImages}
            direction="left"
            speed={50}
            height="h-20 sm:h-24 md:h-32 lg:h-40"
          />
          
          {/* Belt 2 - Scrolling Right (opposite direction) */}
          <InfiniteScrollBelt 
            images={beltTwoImages}
            direction="right"
            speed={48}
            height="h-20 sm:h-24 md:h-32 lg:h-40"
          />
        </div>
      </div>
    </section>
  );
};

