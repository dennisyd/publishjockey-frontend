/**
 * Google Analytics Tracker Component
 * Automatically tracks page views on route changes for public pages
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GoogleAnalyticsService from '../services/GoogleAnalyticsService';

const GoogleAnalyticsTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    GoogleAnalyticsService.trackPageView(location.pathname + location.search);
  }, [location]);

  // This component doesn't render anything
  return null;
};

export default GoogleAnalyticsTracker;
