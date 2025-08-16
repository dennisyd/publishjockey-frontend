// Launch offer configuration (promo mode)
export const LAUNCH_OFFER_CONFIG = {
  // End date/time (local) — format: 'YYYY-MM-DD HH:mm:ss'
  endDate: '2025-12-01 23:59:59',
  // Optional start date to delay activation
  startDate: undefined,

  // Promo pricing (3-year validity on most plans, 1-year for poweruser/agency)
  pricing: {
    single: {
      price: 63,
      originalPrice: 93,
      title: 'Single — PROMO',
      subtitle: 'One-time purchase (3-year validity).',
      booksIncluded: 1,
      imagesIncluded: 11,
      features: [
        { title: '1 book project', included: true },
        { title: 'Full book export (PDF, Word, EPUB)', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Advanced editing tools', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '11 images included', included: true },
        { title: '3-year validity', included: true }
      ],
      buttonText: 'Get Single — $63',
      buttonVariant: 'contained',
      savings: 30
    },
    bundle5: {
      price: 149,
      originalPrice: 199,
      title: '5 Book Pack — PROMO',
      subtitle: 'Great value for multiple books (3-year validity).',
      booksIncluded: 5,
      imagesIncluded: 55,
      features: [
        { title: '5 book projects', included: true },
        { title: 'Full book export (PDF, Word, EPUB)', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '55 images included', included: true },
        { title: '3-year validity', included: true }
      ],
      buttonText: 'Get 5 Books — $149',
      buttonVariant: 'contained',
      savings: 50
    },
    bundle10: {
      price: 299,
      originalPrice: 349,
      title: '10 Book Pack — PROMO',
      subtitle: 'Best value to start (3-year validity).',
      booksIncluded: 10,
      imagesIncluded: 110,
      features: [
        { title: '10 book projects', included: true },
        { title: 'Full book export (PDF, Word, EPUB)', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '110 images included', included: true },
        { title: '3-year validity', included: true }
      ],
      buttonText: 'Get 10 Books — $299',
      buttonVariant: 'contained',
      savings: 50
    },
    bundle20: {
      price: 549,
      originalPrice: 599,
      title: '20 Book Pack — PROMO',
      subtitle: 'Scale your publishing (3-year validity).',
      booksIncluded: 20,
      imagesIncluded: 220,
      features: [
        { title: '20 book projects', included: true },
        { title: 'Full book export (PDF, Word, EPUB)', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '220 images included', included: true },
        { title: '3-year validity', included: true }
      ],
      buttonText: 'Get 20 Books — $549',
      buttonVariant: 'contained',
      savings: 50
    },
    poweruser: {
      price: 948,
      originalPrice: 1188,
      title: 'Power User — PROMO',
      subtitle: 'For prolific authors (1-year validity).',
      booksIncluded: 48,
      imagesIncluded: 528,
      features: [
        { title: '48 book projects', included: true },
        { title: 'Full book export (PDF, Word, EPUB)', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '528 images included', included: true },
        { title: '1-year validity', included: true },
        { title: 'Priority support', included: true }
      ],
      buttonText: 'Get Power User — $948',
      buttonVariant: 'contained',
      savings: 240
    },
    agency: {
      price: 2000,
      originalPrice: 2988,
      title: 'Agency — PROMO',
      subtitle: 'For publishing agencies (1-year validity).',
      booksIncluded: 180,
      imagesIncluded: 1980,
      features: [
        { title: '180 book projects', included: true },
        { title: 'Full book export (PDF, Word, EPUB)', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '1980 images included', included: true },
        { title: '1-year validity', included: true },
        { title: 'Priority support', included: true },
        { title: 'Dedicated account manager', included: true }
      ],
      buttonText: 'Get Agency — $2000',
      buttonVariant: 'contained',
      savings: 988
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