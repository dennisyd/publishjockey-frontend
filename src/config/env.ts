export const ENV = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  EXPORT_API_URL: process.env.REACT_APP_EXPORT_API_URL || 'http://localhost:4000',
  EXPORT_PLATFORM: (process.env.REACT_APP_EXPORT_PLATFORM || 'server').toLowerCase()
};


