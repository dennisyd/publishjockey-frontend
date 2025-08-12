import { http, setAuthToken } from '../services/http';
import { ENV } from '../config/env';

describe('http client', () => {
  it('uses ENV.API_URL as baseURL', () => {
    expect(http.defaults.baseURL?.replace(/\/$/, '')).toBe(ENV.API_URL.replace(/\/$/, ''));
  });

  it('sets and clears Authorization header', () => {
    setAuthToken('abc');
    expect(http.defaults.headers.common.Authorization).toBe('Bearer abc');
    setAuthToken();
    expect(http.defaults.headers.common.Authorization).toBeUndefined();
  });
});


