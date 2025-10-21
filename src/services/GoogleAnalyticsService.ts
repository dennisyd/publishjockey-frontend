/**
 * Google Analytics Service
 * Handles GA tracking for public-facing pages only
 * Respects user privacy - no tracking after login
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

class GoogleAnalyticsService {
  private isInitialized = false;
  private measurementId: string | null = null;
  
  /**
   * Initialize Google Analytics
   */
  initialize(): void {
    if (this.isInitialized) return;
    
    // Use hardcoded measurement ID (environment variable wasn't working in build)
    this.measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-E7MT5P1WHL';
    
    if (!this.measurementId || window.location.hostname === 'localhost') {
      console.log('📊 GA: Not initializing (no ID or localhost)');
      return;
    }
    
    if (typeof window.gtag === 'function') {
      this.isInitialized = true;
      console.log('📊 GA: Initialized with ID:', this.measurementId);
    } else {
      console.warn('📊 GA: gtag not loaded');
    }
  }
  
  /**
   * Check if user is on a public page (should be tracked)
   */
  private isPublicPage(): boolean {
    const path = window.location.pathname;
    
    // Public pages that should be tracked
    const publicPaths = [
      '/',
      '/login',
      '/register', 
      '/forgot-password',
      '/reset-password',
      '/verify-email',
      '/pricing',
      '/about',
      '/contact',
      '/privacy',
      '/terms',
      '/affiliate-signup',
      '/affiliate-agreement',
      '/blog'
    ];
    
    // Check if current path starts with any public path
    return publicPaths.some(publicPath => {
      if (publicPath === '/') {
        return path === '/' || path === '';
      }
      return path.startsWith(publicPath);
    });
  }
  
  /**
   * Check if tracking is enabled
   */
  private canTrack(): boolean {
    return this.isInitialized && 
           typeof window.gtag === 'function' && 
           this.isPublicPage();
  }
  
  /**
   * Track page view
   */
  trackPageView(page?: string): void {
    if (!this.canTrack()) return;
    
    const currentPage = page || window.location.pathname;
    
    window.gtag!('config', this.measurementId!, {
      page_path: currentPage,
      page_title: document.title
    });
    
    console.log('📊 GA: Page view tracked:', currentPage);
  }
  
  /**
   * Track custom event
   */
  trackEvent(eventName: string, parameters?: Record<string, any>): void {
    if (!this.canTrack()) return;
    
    window.gtag!('event', eventName, {
      event_category: 'engagement',
      ...parameters
    });
    
    console.log('📊 GA: Event tracked:', eventName, parameters);
  }
  
  /**
   * Track conversion events
   */
  trackConversion(action: string, parameters?: Record<string, any>): void {
    if (!this.canTrack()) return;
    
    window.gtag!('event', action, {
      event_category: 'conversion',
      ...parameters
    });
    
    console.log('📊 GA: Conversion tracked:', action, parameters);
  }
  
  /**
   * Track sign up
   */
  trackSignUp(method: string = 'email'): void {
    this.trackConversion('sign_up', {
      method: method
    });
  }
  
  /**
   * Track login
   */
  trackLogin(method: string = 'email'): void {
    this.trackConversion('login', {
      method: method
    });
  }
  
  /**
   * Track subscription/purchase
   */
  trackPurchase(transactionId: string, value: number, currency: string = 'USD'): void {
    this.trackConversion('purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency
    });
  }
  
  /**
   * Track form submissions
   */
  trackFormSubmit(formName: string): void {
    this.trackEvent('form_submit', {
      form_name: formName
    });
  }
  
  /**
   * Track link clicks
   */
  trackLinkClick(linkText: string, linkUrl: string): void {
    this.trackEvent('click', {
      link_text: linkText,
      link_url: linkUrl
    });
  }

  /**
   * Track CTA button clicks with detailed context
   */
  trackCTAClick(buttonText: string, buttonType: string, location: string, planName?: string): void {
    this.trackEvent('cta_click', {
      button_text: buttonText,
      button_type: buttonType,
      location: location,
      plan_name: planName || 'none'
    });
  }

  /**
   * Track feature interaction (accordion opens, video plays, etc.)
   */
  trackFeatureInteraction(featureName: string, action: string, details?: Record<string, any>): void {
    this.trackEvent('feature_interaction', {
      feature_name: featureName,
      action: action,
      ...details
    });
  }

  /**
   * Track navigation menu interactions
   */
  trackNavigationClick(menuItem: string, location: string): void {
    this.trackEvent('navigation_click', {
      menu_item: menuItem,
      location: location
    });
  }

  /**
   * Track form interactions (focus, field completion, etc.)
   */
  trackFormInteraction(formName: string, action: string, fieldName?: string): void {
    this.trackEvent('form_interaction', {
      form_name: formName,
      action: action,
      field_name: fieldName || 'none'
    });
  }

  /**
   * Track scroll to specific sections
   */
  trackSectionView(sectionName: string, scrollDepth: number): void {
    this.trackEvent('section_view', {
      section_name: sectionName,
      scroll_depth: scrollDepth
    });
  }
  
  /**
   * Track scroll depth
   */
  trackScrollDepth(percentage: number): void {
    this.trackEvent('scroll', {
      scroll_depth: percentage
    });
  }
  
  /**
   * Privacy-respecting method to disable tracking
   */
  disableTracking(): void {
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
    console.log('📊 GA: Tracking disabled');
  }
  
  /**
   * Enable tracking (for opt-in scenarios)
   */
  enableTracking(): void {
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
    console.log('📊 GA: Tracking enabled');
  }
}

// Export singleton instance
const googleAnalyticsService = new GoogleAnalyticsService();
export default googleAnalyticsService;
