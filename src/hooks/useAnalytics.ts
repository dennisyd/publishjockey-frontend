import { useCallback } from 'react';
import googleAnalyticsService from '../services/GoogleAnalyticsService';

export interface AnalyticsHook {
  // CTA Button Tracking
  trackCTAClick: (buttonText: string, buttonType: string, location: string, planName?: string) => void;

  // Feature Interactions
  trackFeatureInteraction: (featureName: string, action: string, details?: Record<string, any>) => void;

  // Navigation Tracking
  trackNavigationClick: (menuItem: string, location: string) => void;

  // Form Interactions
  trackFormInteraction: (formName: string, action: string, fieldName?: string) => void;

  // Section Views
  trackSectionView: (sectionName: string, scrollDepth: number) => void;

  // Generic Event Tracking
  trackEvent: (eventName: string, parameters?: Record<string, any>) => void;

  // Conversion Tracking
  trackConversion: (action: string, parameters?: Record<string, any>) => void;
}

/**
 * Custom hook for analytics tracking
 * Provides convenient methods for tracking user interactions
 */
export const useAnalytics = (): AnalyticsHook => {
  const trackCTAClick = useCallback((buttonText: string, buttonType: string, location: string, planName?: string) => {
    googleAnalyticsService.trackCTAClick(buttonText, buttonType, location, planName);
  }, []);

  const trackFeatureInteraction = useCallback((featureName: string, action: string, details?: Record<string, any>) => {
    googleAnalyticsService.trackFeatureInteraction(featureName, action, details);
  }, []);

  const trackNavigationClick = useCallback((menuItem: string, location: string) => {
    googleAnalyticsService.trackNavigationClick(menuItem, location);
  }, []);

  const trackFormInteraction = useCallback((formName: string, action: string, fieldName?: string) => {
    googleAnalyticsService.trackFormInteraction(formName, action, fieldName);
  }, []);

  const trackSectionView = useCallback((sectionName: string, scrollDepth: number) => {
    googleAnalyticsService.trackSectionView(sectionName, scrollDepth);
  }, []);

  const trackEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    googleAnalyticsService.trackEvent(eventName, parameters);
  }, []);

  const trackConversion = useCallback((action: string, parameters?: Record<string, any>) => {
    googleAnalyticsService.trackConversion(action, parameters);
  }, []);

  return {
    trackCTAClick,
    trackFeatureInteraction,
    trackNavigationClick,
    trackFormInteraction,
    trackSectionView,
    trackEvent,
    trackConversion,
  };
};
