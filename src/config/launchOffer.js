// Pre-launch offer configuration
export const LAUNCH_OFFER_CONFIG = {
  // Set this to the end date of your pre-launch offer
  // Format: 'YYYY-MM-DD HH:mm:ss' (24-hour format)
  endDate: '2025-09-02 23:59:59', // 45 days from now (July 19 + 45 days)
  
  // Offer details
  isActive: true, // Set to false to manually disable the offer
  
  // Pricing for the pre-launch offer
  pricing: {
    singleBook: {
      price: 49,
      originalPrice: 63,
      title: '✍️ Single Book - LAUNCH OFFER',
      subtitle: 'Perfect for authors publishing their first book with professional-quality output.',
      features: [
        { title: '1 book project', included: true },
        { title: 'Advanced markdown editor', included: true },
        { title: 'Full book export to PDF, Word, and EPUB', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Advanced editing tools', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Email support', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '$100 value: Upscaled cover images for KDP', included: true }
      ],
      buttonText: 'Get Started - LAUNCH OFFER',
      buttonVariant: 'contained',
      popular: true,
      savings: 14 // $63 - $49
    },
    bundle: {
      price: 125,
      originalPrice: 630, // 10 books at $63 each
      title: '🚀 10 Books - LAUNCH OFFER',
      subtitle: 'Perfect for authors with multiple book ideas or small publishing projects.',
      booksIncluded: 10,
      features: [
        { title: '10 book projects', included: true },
        { title: 'Advanced markdown editor', included: true },
        { title: 'Full book export to PDF, Word, and EPUB', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Advanced editing tools', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Priority email support', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '$1,000 value: Upscaled cover images for KDP', included: true },
        { title: 'Valid for 3 years from purchase', included: true }
      ],
      buttonText: 'Get 10 Books - LAUNCH OFFER',
      buttonVariant: 'contained',
      savings: 505 // $630 - $125
    }
  }
};

// Helper function to check if the offer is still active
export const isLaunchOfferActive = () => {
  if (!LAUNCH_OFFER_CONFIG.isActive) return false;
  
  const now = new Date();
  const endDate = new Date(LAUNCH_OFFER_CONFIG.endDate);
  
  return now < endDate;
};

// Helper function to get time remaining
export const getTimeRemaining = () => {
  const now = new Date();
  const endDate = new Date(LAUNCH_OFFER_CONFIG.endDate);
  const timeLeft = endDate - now;
  
  if (timeLeft <= 0) return null;
  
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
};

// Helper function to format time remaining as string
export const formatTimeRemaining = (timeLeft) => {
  if (!timeLeft) return 'Offer Expired';
  
  if (timeLeft.days > 0) {
    return `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`;
  } else if (timeLeft.hours > 0) {
    return `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;
  } else {
    return `${timeLeft.minutes}m ${timeLeft.seconds}s`;
  }
};