/**
 * Secure Token Manager
 * Stores tokens in memory only to prevent XSS attacks
 */

class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<void> | null = null;

  /**
   * Set tokens in memory (not localStorage)
   */
  setTokens(access: string, refresh: string): void {
    this.accessToken = access;
    this.refreshToken = refresh;
  }

  /**
   * Get access token from memory
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Get refresh token from memory
   */
  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  /**
   * Clear all tokens from memory
   */
  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.refreshPromise = null;
  }

  /**
   * Check if user has valid tokens
   */
  hasTokens(): boolean {
    return !!(this.accessToken && this.refreshToken);
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
