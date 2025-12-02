/**
 * Landing Page Sticky Header / Navigation
 * Reusable header component with logo, nav links, and Contact Us CTA
 */

import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logoImage from '../../assets/logo.png';

export const LandingHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleContactUs = () => {
    window.location.href = 'mailto:sam@musicdb.live?subject=MusicDB Inquiry';
  };

  return (
    <nav className={`sticky top-0 bg-white z-50 py-6 border-b border-gray-100 transition-shadow duration-200 ${
      scrolled ? 'shadow-sm' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and Company Name */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <span className="text-2xl md:text-3xl font-bold text-black">MusicDB</span>
            <img 
              src={logoImage} 
              alt="MusicDB Logo" 
              className="h-8 md:h-10 w-auto"
            />
          </div>
          
          {/* Desktop Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('use-cases')}
              className="text-black hover:text-gray-700 font-medium transition-colors text-xl"
            >
              Use Cases
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-black hover:text-gray-700 font-medium transition-colors text-xl"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-black hover:text-gray-700 font-medium transition-colors text-xl"
            >
              FAQ
            </button>
          </div>
          
          {/* Desktop CTA - Hidden on mobile */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleContactUs}
              className="bg-black text-white hover:bg-gray-800 px-7 py-2.5 rounded-lg font-medium transition-colors text-lg"
            >
              Contact Us
            </button>
          </div>

          {/* Mobile menu button - Visible only on mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-black hover:text-gray-700 p-2"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - Animated slide-down */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mt-4 pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('use-cases')}
                className="text-black hover:text-gray-700 font-medium transition-colors text-xl text-left"
              >
                Use Cases
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-black hover:text-gray-700 font-medium transition-colors text-xl text-left"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-black hover:text-gray-700 font-medium transition-colors text-xl text-left"
              >
                FAQ
              </button>
              <button
                onClick={handleContactUs}
                className="bg-black text-white hover:bg-gray-800 px-7 py-2.5 rounded-lg font-medium transition-colors w-full text-lg"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

