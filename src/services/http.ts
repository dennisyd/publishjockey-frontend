import axios from 'axios';
import { ENV } from '../config/env';

// Centralized Axios instance for frontend API calls
export const http = axios.create({
  baseURL: ENV.API_URL.replace(/\/$/, ''),
  withCredentials: false
});

// Helper to manage Authorization header in one place
export function setAuthToken(token?: string): void {
  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common.Authorization;
  }
}


