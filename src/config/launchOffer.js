// Launch offer configuration (promo mode)
export const LAUNCH_OFFER_CONFIG = {
  // End date/time (local) — format: 'YYYY-MM-DD HH:mm:ss'
  endDate: '2025-12-01 23:59:59',
  // Optional start date to delay activation
  startDate: undefined,

  // Promo pricing (3-year validity on all plans)
  pricing: {
    single: {
      price: 49,
      originalPrice: 63,
      title: '✍️ Single — LAUNCH OFFER',
      subtitle: 'One-time purchase (3-year validity).',
      booksIncluded: 1,
      features: [
        { title: '1 book project', included: true },
        { title: 'Full book export (PDF, Word, EPUB)', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Advanced editing tools', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '12 images included', included: true }
      ],
      buttonText: 'Get Single — $49',
      buttonVariant: 'contained',
      savings: 14
    },
    bundle10: {
      price: 125,
      originalPrice: 630, // 10 × $63
      title: '🚀 10 Book Pack — LAUNCH OFFER',
      subtitle: 'Best value to start (3-year validity).',
      booksIncluded: 10,
      features: [
        { title: '10 book projects', included: true },
        { title: 'Full book export (PDF, Word, EPUB)', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '120 images included', included: true }
      ],
      buttonText: 'Get 10 Books — $125',
      buttonVariant: 'contained',
      savings: 505
    },
    bundle20: {
      price: 199,
      originalPrice: 1260, // 20 × $63
      title: '🚀 20 Book Pack — LAUNCH OFFER',
      subtitle: 'Scale your publishing (3-year validity).',
      booksIncluded: 20,
      features: [
        { title: '20 book projects', included: true },
        { title: 'Full book export (PDF, Word, EPUB)', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '220 images included', included: true }
      ],
      buttonText: 'Get 20 Books — $199',
      buttonVariant: 'contained',
      savings: 1061
    }
  }
};

// Helper function to check if the offer is still active
export const isLaunchOfferActive = () => {
  const now = new Date();
  const endDate = new Date(LAUNCH_OFFER_CONFIG.endDate);
  const startDate = LAUNCH_OFFER_CONFIG.startDate ? new Date(LAUNCH_OFFER_CONFIG.startDate) : null;
  if (Number.isNaN(endDate.getTime())) return false;
  if (startDate && Number.isNaN(startDate.getTime())) return false;
  const afterStart = startDate ? now >= startDate : true;
  return afterStart && now < endDate;
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