// Launch offer configuration (promo mode)
export const LAUNCH_OFFER_CONFIG = {
  // End date/time (local) — format: 'YYYY-MM-DD HH:mm:ss'
  endDate: '2025-07-31 23:59:59',
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
      price: 249,
      originalPrice: 349,
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
      buttonText: 'Get 5 Books — $249',
      buttonVariant: 'contained',
      savings: 100
    },
    bundle10: {
      price: 399,
      originalPrice: 599,
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
      buttonText: 'Get 10 Books — $399',
      buttonVariant: 'contained',
      savings: 200
    },
    bundle20: {
      price: 699,
      originalPrice: 999,
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
      buttonText: 'Get 20 Books — $699',
      buttonVariant: 'contained',
      savings: 300
    },
    poweruser: {
      price: 1500,
      originalPrice: 2250,
      title: 'Power User — PROMO',
      subtitle: 'For prolific authors (1-year validity).',
      booksIncluded: 50,
      imagesIncluded: 550,
      features: [
        { title: '50 book projects', included: true },
        { title: 'Full book export (PDF, Word, EPUB)', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '550 images included', included: true },
        { title: '1-year validity', included: true },
        { title: 'Priority support', included: true }
      ],
      buttonText: 'Get Power User — $1,500',
      buttonVariant: 'contained',
      savings: 750
    },
    agency: {
      price: 2500,
      originalPrice: 3500,
      title: 'Agency — PROMO',
      subtitle: 'For publishing agencies (1-year validity).',
      booksIncluded: 100,
      imagesIncluded: 1100,
      features: [
        { title: '100 book projects', included: true },
        { title: 'Full book export (PDF, Word, EPUB)', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '1100 images included', included: true },
        { title: '1-year validity', included: true },
        { title: 'Priority support', included: true },
        { title: 'Dedicated account manager', included: true }
      ],
      buttonText: 'Get Agency — $2,500',
      buttonVariant: 'contained',
      savings: 1000
    },
    // Ebook plans (50-page limit)
    eSingle: {
      price: 31,
      originalPrice: 46,
      title: 'Ebook Single — PROMO',
      subtitle: 'Ebook-focused plan with 50-page limit (3-year validity).',
      booksIncluded: 1,
      imagesIncluded: 11,
      pageLimit: 50,
      features: [
        { title: '1 book project', included: true },
        { title: 'Full book export (PDF, Word, EPUB)', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '11 images included', included: true },
        { title: '50-page limit', included: true },
        { title: '3-year validity', included: true }
      ],
      buttonText: 'Get Ebook Single — $31',
      buttonVariant: 'contained',
      savings: 15
    },
    ebundle5: {
      price: 124,
      originalPrice: 174,
      title: 'Ebook 5 Pack — PROMO',
      subtitle: 'Ebook-focused plan for multiple books (3-year validity).',
      booksIncluded: 5,
      imagesIncluded: 55,
      pageLimit: 50,
      features: [
        { title: '5 book projects', included: true },
        { title: 'Full book export (PDF, Word, EPUB)', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '55 images included', included: true },
        { title: '50-page limit', included: true },
        { title: '3-year validity', included: true }
      ],
      buttonText: 'Get Ebook 5 Pack — $124',
      buttonVariant: 'contained',
      savings: 50
    },
    ebundle10: {
      price: 199,
      originalPrice: 299,
      title: 'Ebook 10 Pack — PROMO',
      subtitle: 'Ebook-focused plan for serious authors (3-year validity).',
      booksIncluded: 10,
      imagesIncluded: 110,
      pageLimit: 50,
      features: [
        { title: '10 book projects', included: true },
        { title: 'Full book export (PDF, Word, EPUB)', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '110 images included', included: true },
        { title: '50-page limit', included: true },
        { title: '3-year validity', included: true }
      ],
      buttonText: 'Get Ebook 10 Pack — $199',
      buttonVariant: 'contained',
      savings: 100
    },
    ebundle20: {
      price: 349,
      originalPrice: 499,
      title: 'Ebook 20 Pack — PROMO',
      subtitle: 'Ebook-focused plan for prolific authors (3-year validity).',
      booksIncluded: 20,
      imagesIncluded: 220,
      pageLimit: 50,
      features: [
        { title: '20 book projects', included: true },
        { title: 'Full book export (PDF, Word, EPUB)', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '220 images included', included: true },
        { title: '50-page limit', included: true },
        { title: '3-year validity', included: true }
      ],
      buttonText: 'Get Ebook 20 Pack — $349',
      buttonVariant: 'contained',
      savings: 150
    },
    epoweruser: {
      price: 750,
      originalPrice: 1125,
      title: 'Ebook Power User — PROMO',
      subtitle: 'Ebook-focused plan for prolific authors (1-year validity).',
      booksIncluded: 50,
      imagesIncluded: 550,
      pageLimit: 50,
      features: [
        { title: '50 book projects', included: true },
        { title: 'Full book export (PDF, Word, EPUB)', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '550 images included', included: true },
        { title: '50-page limit', included: true },
        { title: '1-year validity', included: true },
        { title: 'Priority support', included: true }
      ],
      buttonText: 'Get Ebook Power User — $750',
      buttonVariant: 'contained',
      savings: 375
    },
    eagency: {
      price: 1250,
      originalPrice: 1750,
      title: 'Ebook Agency — PROMO',
      subtitle: 'Ebook-focused plan for publishing agencies (1-year validity).',
      booksIncluded: 100,
      imagesIncluded: 1100,
      pageLimit: 50,
      features: [
        { title: '100 book projects', included: true },
        { title: 'Full book export (PDF, Word, EPUB)', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '1100 images included', included: true },
        { title: '50-page limit', included: true },
        { title: '1-year validity', included: true },
        { title: 'Priority support', included: true },
        { title: 'Dedicated account manager', included: true }
      ],
      buttonText: 'Get Ebook Agency — $1,250',
      buttonVariant: 'contained',
      savings: 500
    },
    // Full-service plans
    fullService: {
      price: 449,
      originalPrice: 499,
      title: 'Full Service — PROMO',
      subtitle: 'Complete publishing package with custom cover designs.',
      booksIncluded: 1,
      imagesIncluded: 11,
      features: [
        { title: '1 book project', included: true },
        { title: 'Full book export (PDF, Word, EPUB)', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '11 images included', included: true },
        { title: '3 custom cover designs', included: true },
        { title: 'Final PDF and eBook delivery within 72 hours of cover approval', included: true }
      ],
      buttonText: 'Get Full Service — $449',
      buttonVariant: 'contained',
      savings: 50
    },
    fullServicePlus: {
      price: 549,
      originalPrice: 599,
      title: 'Full Service Plus — PROMO',
      subtitle: 'Complete package with custom covers and KDP setup guidance.',
      booksIncluded: 1,
      imagesIncluded: 11,
      features: [
        { title: '1 book project', included: true },
        { title: 'Full book export (PDF, Word, EPUB)', included: true },
        { title: 'AI-assisted formatting', included: true },
        { title: 'Watermark-free output', included: true },
        { title: 'Word document splitting by H1 sections', included: true },
        { title: '11 images included', included: true },
        { title: '3 custom cover designs', included: true },
        { title: '30-minute guided KDP Amazon setup session', included: true },
        { title: 'Final PDF and eBook delivery within 72 hours of cover approval', included: true }
      ],
      buttonText: 'Get Full Service Plus — $549',
      buttonVariant: 'contained',
      savings: 50
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