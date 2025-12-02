/**
 * Landing Page Footer Section
 * Dark footer with logo, tagline, and contact info
 */

import { EnvelopeIcon } from '@heroicons/react/24/outline';
import logoImage from '../../assets/logo.png';

// LinkedIn icon component
const LinkedInIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export const LandingFooterSection = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center space-x-2 md:space-x-3 mb-3 md:mb-4">
          <img 
            src={logoImage} 
            alt="MusicDB Logo" 
            className="h-6 md:h-8 w-auto"
          />
          <span className="text-xl md:text-2xl font-bold">MusicDB</span>
        </div>
        <p className="text-sm md:text-base text-gray-400 mb-5 md:mb-6 px-4">
          Connecting venues with artists to create unforgettable live music experiences
        </p>
        
        {/* Contact Information */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          {/* Email */}
          <a 
            href="mailto:sam@musicdb.live"
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm md:text-base"
          >
            <EnvelopeIcon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
            <span>sam@musicdb.live</span>
          </a>
          
          {/* LinkedIn */}
          <a 
            href="https://www.linkedin.com/company/musicdb/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm md:text-base"
          >
            <LinkedInIcon />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

