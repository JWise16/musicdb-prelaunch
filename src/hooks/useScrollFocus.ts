import { useEffect, useRef, useState } from 'react';

interface UseScrollFocusOptions {
  /** Top boundary of focus zone (0-1, percentage of viewport). Default: 0.25 */
  focusTop?: number;
  /** Bottom boundary of focus zone (0-1, percentage of viewport). Default: 0.75 */
  focusBottom?: number;
  /** Threshold for initial visibility animation. Default: 0.2 */
  visibilityThreshold?: number;
}

interface UseScrollFocusResult {
  ref: React.RefObject<HTMLDivElement | null>;
  /** True when element has entered viewport (triggers once for fade-in) */
  isVisible: boolean;
  /** True when element's center is within the focus zone (toggles as you scroll) */
  isInFocus: boolean;
}

/**
 * Hook that tracks both initial visibility (for fade-in animations)
 * and ongoing focus state (for scroll-based effects like straightening images).
 * 
 * The "focus zone" is the middle portion of the viewport where content
 * is considered "active" or being read.
 */
export const useScrollFocus = (options: UseScrollFocusOptions = {}): UseScrollFocusResult => {
  const {
    focusTop = 0.25,
    focusBottom = 0.75,
    visibilityThreshold = 0.2
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInFocus, setIsInFocus] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Observer for initial visibility (fade-in animation - triggers once)
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          visibilityObserver.unobserve(element);
        }
      },
      { threshold: visibilityThreshold }
    );

    visibilityObserver.observe(element);

    // Scroll handler for focus state (straightening effect - toggles)
    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const viewportHeight = window.innerHeight;
      
      // Calculate the focus zone boundaries in pixels
      const focusTopPx = viewportHeight * focusTop;
      const focusBottomPx = viewportHeight * focusBottom;
      
      // Check if element's center is within the focus zone
      const inFocus = elementCenter >= focusTopPx && elementCenter <= focusBottomPx;
      setIsInFocus(inFocus);
    };

    // Initial check
    handleScroll();

    // Throttled scroll listener for performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      visibilityObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [focusTop, focusBottom, visibilityThreshold]);

  return { ref, isVisible, isInFocus };
};

