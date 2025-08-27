import { http } from './http';

export interface AffiliateProfile {
  id: string;
  affiliateCode: string;
  status: 'pending' | 'active' | 'suspended' | 'terminated';
  commissionRate: number;
  totalReferrals: number;
  totalSales: number;
  totalCommissions: number;
  totalPaid: number;
  payoutInfo: {
    paypalEmail?: string;
    bankInfo?: {
      accountName?: string;
      accountNumber?: string;
      routingNumber?: string;
      bankName?: string;
    };
  };
  createdAt: string;
}

export interface Referral {
  _id: string;
  affiliateId: string;
  referredUserId?: {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  affiliateCode: string;
  source: 'direct_link' | 'email' | 'social_media' | 'blog' | 'other';
  campaign?: string;
  status: 'clicked' | 'registered' | 'converted' | 'expired';
  clickedAt: string;
  registeredAt?: string;
  convertedAt?: string;
  sale?: {
    planId: string;
    planName: string;
    amount: number;
    stripePaymentIntentId: string;
  };
  commission?: {
    amount: number;
    rate: number;
    status: 'pending' | 'approved' | 'paid' | 'cancelled';
  };
  fraudScore: number;
  createdAt: string;
}

export interface Commission {
  _id: string;
  affiliateId: string;
  referralId: string;
  sale: {
    planId: string;
    planName: string;
    amount: number;
    stripePaymentIntentId: string;
  };
  amount: number;
  rate: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  payout: {
    method: 'paypal' | 'bank_transfer' | 'stripe';
    transactionId?: string;
    paidAt?: string;
    scheduledFor?: string;
  };
  eligibleForPayout: string;
  notes?: string;
  fraudScore: number;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  paidAt?: string;
}

export interface AffiliateRegistrationData {
  paypalEmail: string;
  bankInfo: {
    accountName: string;
    accountNumber: string;
    routingNumber: string;
    bankName: string;
  };
}

export interface PayoutInfoData {
  paypalEmail: string;
  bankInfo: {
    accountName: string;
    accountNumber: string;
    routingNumber: string;
    bankName: string;
  };
}

export interface ReferralsResponse {
  success: boolean;
  referrals: Referral[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface CommissionsResponse {
  success: boolean;
  commissions: Commission[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface AffiliateProfileResponse {
  success: boolean;
  affiliate: AffiliateProfile;
  recentReferrals: Referral[];
  pendingCommissions: Commission[];
  eligibleCommissions: Commission[];
}

export interface AffiliateRegistrationResponse {
  success: boolean;
  message: string;
  affiliate: {
    id: string;
    affiliateCode: string;
    status: string;
  };
}

export interface PayoutInfoResponse {
  success: boolean;
  message: string;
}

export interface TrackingLinkResponse {
  success: boolean;
  trackingLink: string;
  affiliateCode: string;
}

class AffiliateService {
  /**
   * Get affiliate profile and stats
   */
  async getProfile(): Promise<AffiliateProfileResponse> {
    const response = await http.get('/affiliates/profile');
    return response.data;
  }

  /**
   * Register as an affiliate
   */
  async register(data: AffiliateRegistrationData): Promise<AffiliateRegistrationResponse> {
    const response = await http.post('/affiliates/register', data);
    return response.data;
  }

  /**
   * Get referrals with pagination
   */
  async getReferrals(page: number = 1, limit: number = 20, status?: string): Promise<ReferralsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (status) {
      params.append('status', status);
    }
    
    const response = await http.get(`/affiliates/referrals?${params}`);
    return response.data;
  }

  /**
   * Get commissions with pagination
   */
  async getCommissions(page: number = 1, limit: number = 20, status?: string): Promise<CommissionsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (status) {
      params.append('status', status);
    }
    
    const response = await http.get(`/affiliates/commissions?${params}`);
    return response.data;
  }

  /**
   * Update payout information
   */
  async updatePayoutInfo(data: PayoutInfoData): Promise<PayoutInfoResponse> {
    const response = await http.put('/affiliates/payout-info', data);
    return response.data;
  }

  /**
   * Get tracking link for affiliate code
   */
  async getTrackingLink(code: string): Promise<TrackingLinkResponse> {
    const response = await http.get(`/affiliates/tracking-link/${code}`);
    return response.data;
  }

  /**
   * Generate tracking link for current user
   */
  generateTrackingLink(affiliateCode: string): string {
    return `${window.location.origin}/register?ref=${affiliateCode}`;
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Get status color for UI
   */
  getStatusColor(status: string): 'success' | 'warning' | 'error' | 'default' {
    switch (status) {
      case 'active':
      case 'converted':
      case 'paid':
        return 'success';
      case 'pending':
      case 'approved':
        return 'warning';
      case 'suspended':
      case 'terminated':
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  }

  /**
   * Get commission status color for UI
   */
  getCommissionStatusColor(status: string): 'success' | 'warning' | 'info' | 'default' {
    switch (status) {
      case 'paid':
        return 'success';
      case 'approved':
        return 'info';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  }

  /**
   * Calculate commission amount
   */
  calculateCommission(saleAmount: number, commissionRate: number): number {
    return saleAmount * commissionRate;
  }

  /**
   * Check if commission is eligible for payout
   */
  isEligibleForPayout(commission: Commission): boolean {
    return commission.status === 'approved' && new Date() >= new Date(commission.eligibleForPayout);
  }

  /**
   * Get days until payout
   */
  getDaysUntilPayout(eligibleDate: string): number {
    const eligible = new Date(eligibleDate);
    const now = new Date();
    const diffTime = eligible.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  /**
   * Copy text to clipboard
   */
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  /**
   * Share tracking link
   */
  async shareTrackingLink(url: string, title: string = 'Check out PublishJockey'): Promise<boolean> {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
          text: 'I found this amazing book publishing platform. You should check it out!'
        });
        return true;
      } catch (error) {
        console.error('Failed to share:', error);
        return false;
      }
    }
    return false;
  }
}

export const affiliateService = new AffiliateService();
export default affiliateService;
