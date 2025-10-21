import { useEffect, useRef } from 'react';
import { useAnalytics } from './useAnalytics';

interface SectionConfig {
  id: string;
  name: string;
  threshold?: number;
}

interface UseScrollTrackingOptions {
  sections: SectionConfig[];
  trackOnMount?: boolean;
}

/**
 * Hook for tracking scroll-based section views
 * Automatically tracks when users scroll to different sections
 */
export const useScrollTracking = ({ sections, trackOnMount = false }: UseScrollTrackingOptions) => {
  const { trackSectionView } = useAnalytics();
  const observedSections = useRef<Set<string>>(new Set());
  const scrollDepths = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          const sectionConfig = sections.find(s => s.id === sectionId);

          if (!sectionConfig) return;

          const { name } = sectionConfig;
          const threshold = sectionConfig.threshold || 0.5;

          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            // Track if we haven't already tracked this section
            if (!observedSections.current.has(sectionId)) {
              const scrollDepth = Math.round(window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100);
              trackSectionView(name, scrollDepth);
              observedSections.current.add(sectionId);
              scrollDepths.current.set(sectionId, scrollDepth);
            }
          }
        });
      },
      {
        threshold: [0.1, 0.25, 0.5, 0.75, 1.0],
        rootMargin: '0px 0px -10% 0px' // Trigger slightly before fully in view
      }
    );

    // Observe all sections
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // Track initial view if requested
    if (trackOnMount) {
      const scrollDepth = Math.round(window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100);
      trackSectionView('initial_load', scrollDepth);
    }

    return () => {
      observer.disconnect();
      observedSections.current.clear();
      scrollDepths.current.clear();
    };
  }, [sections, trackSectionView, trackOnMount]);

  // Function to manually track a section view (useful for SPA navigation)
  const trackSectionManually = (sectionName: string) => {
    const scrollDepth = Math.round(window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100);
    trackSectionView(sectionName, scrollDepth);
    observedSections.current.add(sectionName);
  };

  return {
    trackSectionManually,
    getTrackedSections: () => Array.from(observedSections.current),
    getScrollDepths: () => Object.fromEntries(scrollDepths.current)
  };
};
