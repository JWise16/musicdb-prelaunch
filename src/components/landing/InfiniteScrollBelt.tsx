/**
 * Infinite Scroll Belt Component
 * Creates a seamless infinite scrolling belt of images
 * Supports opposite directions, pause on hover, and respects reduced motion preferences
 */

interface InfiniteScrollBeltProps {
  images: string[];
  direction?: 'left' | 'right';
  speed?: number; // seconds per cycle
  height?: string; // Tailwind class for height
}

export const InfiniteScrollBelt = ({ 
  images, 
  direction = 'left',
  speed = 50,
  height = 'h-48 md:h-56 lg:h-64'
}: InfiniteScrollBeltProps) => {
  // Duplicate images 3 times for seamless infinite scroll
  const duplicatedImages = [...images, ...images, ...images];
  
  const animationDirection = direction === 'left' ? 'scroll-left' : 'scroll-right';

  return (
    <div className="relative w-full overflow-hidden">
      {/* Gradient overlays on edges for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 lg:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 lg:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      {/* Scrolling belt container */}
      <div 
        className="flex gap-4 md:gap-6 items-center hover:pause-animation"
        style={{
          animation: `${animationDirection} ${speed}s linear infinite`,
        }}
      >
        {duplicatedImages.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt=""
            role="presentation"
            className={`${height} w-auto object-cover rounded-lg shadow-sm flex-shrink-0`}
            loading="lazy"
          />
        ))}
      </div>
      
      {/* CSS Animation Definitions */}
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        @keyframes scroll-right {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        /* Pause animation on hover */
        .hover\\:pause-animation:hover {
          animation-play-state: paused;
        }
        
        /* Respect reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .hover\\:pause-animation {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

