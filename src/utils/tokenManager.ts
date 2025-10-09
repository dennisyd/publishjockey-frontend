/**
 * Secure Token Manager
 * Stores tokens in sessionStorage with memory cache for performance
 * sessionStorage is cleared when tab closes (more secure than localStorage)
 */

class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<void> | null = null;
  private readonly ACCESS_TOKEN_KEY = 'pj_access_token';
  private readonly REFRESH_TOKEN_KEY = 'pj_refresh_token';

  constructor() {
    // Initialize from sessionStorage on creation
    this.loadFromStorage();
  }

  /**
   * Load tokens from sessionStorage to memory
   */
  private loadFromStorage(): void {
    try {
      this.accessToken = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
      this.refreshToken = sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to load tokens from storage:', error);
    }
  }

  /**
   * Set tokens in memory and sessionStorage
   */
  setTokens(access: string, refresh: string): void {
    this.accessToken = access;
    this.refreshToken = refresh;
    
    try {
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, access);
      sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refresh);
    } catch (error) {
      console.error('Failed to save tokens to storage:', error);
    }
  }

  /**
   * Get access token from memory (with fallback to sessionStorage)
   */
  getAccessToken(): string | null {
    if (!this.accessToken) {
      this.loadFromStorage();
    }
    return this.accessToken;
  }

  /**
   * Get refresh token from memory (with fallback to sessionStorage)
   */
  getRefreshToken(): string | null {
    if (!this.refreshToken) {
      this.loadFromStorage();
    }
    return this.refreshToken;
  }

  /**
   * Clear all tokens from memory and sessionStorage
   */
  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.refreshPromise = null;
    
    try {
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear tokens from storage:', error);
    }
  }

  /**
   * Check if user has valid tokens
   */
  hasTokens(): boolean {
    const access = this.getAccessToken();
    const refresh = this.getRefreshToken();
    return !!(access && refresh);
  }

  /**
   * Check if access token is expired
   */
  isAccessTokenExpired(): boolean {
    if (!this.accessToken) return true;
    
    try {
      const payload = JSON.parse(atob(this.accessToken.split('.')[1]));
      const expTime = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      
      // Consider expired if less than 1 minute remaining
      return (expTime - now) < 60 * 1000;
    } catch (error) {
      console.error('Error parsing access token:', error);
      return true;
    }
  }

  /**
   * Check if refresh token is expired
   */
  isRefreshTokenExpired(): boolean {
    if (!this.refreshToken) return true;
    
    try {
      const payload = JSON.parse(atob(this.refreshToken.split('.')[1]));
      const expTime = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      
      return expTime < now;
    } catch (error) {
      console.error('Error parsing refresh token:', error);
      return true;
    }
  }

  /**
   * Get time until access token expires (in minutes)
   */
  getTimeUntilExpiry(): number {
    if (!this.accessToken) return 0;
    
    try {
      const payload = JSON.parse(atob(this.accessToken.split('.')[1]));
      const expTime = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      
      return Math.max(0, Math.floor((expTime - now) / (60 * 1000)));
    } catch (error) {
      console.error('Error calculating token expiry:', error);
      return 0;
    }
  }

  /**
   * Refresh tokens with deduplication
   */
  async refreshTokens(): Promise<void> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    
    this.refreshPromise = this.performRefresh();
    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual token refresh
   */
  private async performRefresh(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    if (this.isRefreshTokenExpired()) {
      throw new Error('Refresh token expired');
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken
        })
      });

      if (!response.ok) {
        throw new Error(`Refresh failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.token) {
        this.setTokens(data.token, data.refreshToken || this.refreshToken);
      } else {
        throw new Error('Invalid refresh response');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      throw error;
    }
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();
export default tokenManager;
