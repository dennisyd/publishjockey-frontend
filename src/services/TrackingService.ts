import ReactGA from 'react-ga4';
import ReactPixel from 'react-facebook-pixel';
import mixpanel from 'mixpanel-browser';
import Cookies from 'js-cookie';
import queryString from 'query-string';

class TrackingService {
  private isInitialized = false;

  /**
   * Initialize all tracking services
   */
  initialize() {
    if (this.isInitialized) return;

    // Initialize Google Analytics 4
    if (process.env.REACT_APP_GA4_ID) {
      ReactGA.initialize(process.env.REACT_APP_GA4_ID);
    }

    // Initialize Facebook Pixel
    if (process.env.REACT_APP_FACEBOOK_PIXEL_ID) {
      ReactPixel.init(process.env.REACT_APP_FACEBOOK_PIXEL_ID);
    }

    // Initialize Mixpanel
    if (process.env.REACT_APP_MIXPANEL_TOKEN) {
      mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN);
    }

    this.isInitialized = true;
  }

  /**
   * Track referral click
   */
  trackReferralClick(affiliateCode: string, source: string) {
    this.initialize();

    // Store referral data in cookies
    Cookies.set('referral_code', affiliateCode, { expires: 30 }); // 30 days
    Cookies.set('referral_source', source, { expires: 30 });

    // Track in analytics
    ReactGA.event({
      category: 'Affiliate',
      action: 'Referral Click',
      label: affiliateCode,
      value: 1
    });

    ReactPixel.track('ReferralClick', {
      affiliate_code: affiliateCode,
      source: source
    });

    mixpanel.track('Referral Click', {
      affiliate_code: affiliateCode,
      source: source
    });
  }

  /**
   * Track user registration with referral
   */
  trackReferralRegistration(userId: string, email: string) {
    this.initialize();

    const referralCode = Cookies.get('referral_code');
    const referralSource = Cookies.get('referral_source');

    if (referralCode) {
      ReactGA.event({
        category: 'Affiliate',
        action: 'Referral Registration',
        label: referralCode,
        value: 1
      });

      ReactPixel.track('ReferralRegistration', {
        affiliate_code: referralCode,
        source: referralSource,
        user_id: userId,
        email: email
      });

      mixpanel.track('Referral Registration', {
        affiliate_code: referralCode,
        source: referralSource,
        user_id: userId,
        email: email
      });

      // Clear referral cookies after successful registration
      Cookies.remove('referral_code');
      Cookies.remove('referral_source');
    }
  }

  /**
   * Track conversion (purchase)
   */
  trackConversion(orderId: string, amount: number, currency: string = 'USD') {
    this.initialize();

    const referralCode = Cookies.get('referral_code');

    ReactGA.event({
      category: 'Affiliate',
      action: 'Conversion',
      label: referralCode || 'direct',
      value: Math.round(amount * 100) // GA expects cents
    });

    ReactPixel.track('Purchase', {
      value: amount,
      currency: currency,
      affiliate_code: referralCode,
      order_id: orderId
    });

    mixpanel.track('Purchase', {
      value: amount,
      currency: currency,
      affiliate_code: referralCode,
      order_id: orderId
    });
  }

  /**
   * Track affiliate link generation
   */
  trackAffiliateLinkGeneration(affiliateCode: string) {
    this.initialize();

    ReactGA.event({
      category: 'Affiliate',
      action: 'Link Generated',
      label: affiliateCode
    });

    mixpanel.track('Affiliate Link Generated', {
      affiliate_code: affiliateCode
    });
  }

  /**
   * Track commission earned
   */
  trackCommissionEarned(affiliateCode: string, amount: number, orderId: string) {
    this.initialize();

    ReactGA.event({
      category: 'Affiliate',
      action: 'Commission Earned',
      label: affiliateCode,
      value: Math.round(amount * 100)
    });

    mixpanel.track('Commission Earned', {
      affiliate_code: affiliateCode,
      amount: amount,
      order_id: orderId
    });
  }

  /**
   * Get referral data from URL parameters
   */
  getReferralFromURL(): { code?: string; source?: string } {
    const parsed = queryString.parse(window.location.search);
    return {
      code: parsed.ref as string,
      source: parsed.source as string
    };
  }

  /**
   * Set user properties for tracking
   */
  setUserProperties(userId: string, email: string, properties: Record<string, any> = {}) {
    this.initialize();

    // Set user ID for all tracking services
    ReactGA.set({ userId });
    mixpanel.identify(userId);
    mixpanel.people.set({
      $email: email,
      ...properties
    });
  }

  /**
   * Track page views
   */
  trackPageView(page: string) {
    this.initialize();

    ReactGA.send({ hitType: 'pageview', page });
    ReactPixel.pageView();
    mixpanel.track('Page View', { page });
  }
}

export default new TrackingService();
