class TrackingService {
  private isInitialized = false;

  /**
   * Initialize tracking service
   */
  initialize() {
    if (this.isInitialized) return;

    this.isInitialized = true;
    console.log('📊 Tracking service initialized');
  }

  /**
   * Set a cookie
   */
  private setCookie(name: string, value: string, days: number = 30) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  /**
   * Get a cookie value
   */
  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  /**
   * Remove a cookie
   */
  private removeCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  /**
   * Track referral click
   */
  trackReferralClick(affiliateCode: string, source: string) {
    this.initialize();

    // Store referral data in cookies
    this.setCookie('referral_code', affiliateCode, 30);
    this.setCookie('referral_source', source, 30);

    console.log('📊 Referral click tracked:', { affiliateCode, source });
  }

  /**
   * Track user registration with referral
   */
  trackReferralRegistration(userId: string, email: string) {
    this.initialize();

    const referralCode = this.getCookie('referral_code');
    const referralSource = this.getCookie('referral_source');

    if (referralCode) {
      console.log('📊 Referral registration tracked:', { 
        referralCode, 
        referralSource, 
        userId, 
        email 
      });

      // Clear referral cookies after successful registration
      this.removeCookie('referral_code');
      this.removeCookie('referral_source');
    }
  }

  /**
   * Track conversion (purchase)
   */
  trackConversion(orderId: string, amount: number, currency: string = 'USD') {
    this.initialize();

    const referralCode = this.getCookie('referral_code');

    console.log('📊 Conversion tracked:', { 
      orderId, 
      amount, 
      currency, 
      referralCode: referralCode || 'direct' 
    });
  }

  /**
   * Track affiliate link generation
   */
  trackAffiliateLinkGeneration(affiliateCode: string) {
    this.initialize();

    console.log('📊 Affiliate link generated:', { affiliateCode });
  }

  /**
   * Track commission earned
   */
  trackCommissionEarned(affiliateCode: string, amount: number, orderId: string) {
    this.initialize();

    console.log('📊 Commission earned tracked:', { 
      affiliateCode, 
      amount, 
      orderId 
    });
  }

  /**
   * Get referral data from URL parameters
   */
  getReferralFromURL(): { code?: string; source?: string } {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      code: urlParams.get('ref') || undefined,
      source: urlParams.get('source') || undefined
    };
  }

  /**
   * Set user properties for tracking
   */
  setUserProperties(userId: string, email: string, properties: Record<string, any> = {}) {
    this.initialize();

    console.log('📊 User properties set:', { userId, email, properties });
  }

  /**
   * Track page views
   */
  trackPageView(page: string) {
    this.initialize();

    console.log('📊 Page view tracked:', { page });
  }
}

export default new TrackingService();
