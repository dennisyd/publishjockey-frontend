import { http } from './http';
import { ENV } from '../config/env';

const API_URL = ENV.API_URL.replace(/\/$/, '').replace(/\/api$/, '');

/**
 * Creates a Stripe checkout session for the specified plan
 * @param planId The ID of the plan to purchase
 * @param successUrl Optional custom success URL
 * @param cancelUrl Optional custom cancel URL
 * @returns The Stripe checkout session information
 */
export const createCheckoutSession = async (
  planId: string,
  successUrl?: string,
  cancelUrl?: string
): Promise<{ sessionId: string; url: string }> => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await http.post(
      `${API_URL}/api/stripe/create-checkout-session`,
      {
        planId,
        successUrl,
        cancelUrl
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data as { sessionId: string; url: string };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

/**
 * Verifies a checkout session after payment completion
 * @param sessionId The ID of the completed Stripe session
 * @returns Session details and updated subscription information
 */
export const verifySession = async (sessionId: string) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await http.get(
      `${API_URL}/api/stripe/verify-session/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error verifying session:', error);
    throw error;
  }
};

/**
 * Redirects the user to Stripe Checkout for the specified plan
 * @param planId The ID of the plan to purchase
 */
export const redirectToCheckout = async (planId: string): Promise<void> => {
  try {
    const { url } = await createCheckoutSession(planId);
    
    // Redirect to Stripe Checkout
    window.location.href = url;
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
};

const stripeService = {
  createCheckoutSession,
  verifySession,
  redirectToCheckout
};

export default stripeService; 