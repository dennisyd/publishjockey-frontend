// Support both v1 and v2 of http-proxy-middleware
const proxyModule = require('http-proxy-middleware');
const createProxyMiddleware = proxyModule.createProxyMiddleware || proxyModule;

module.exports = function (app) {
  // Backend API
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  );

  // Export backend API (for PDF generation, etc.)
  app.use(
    ['/export', '/ping', '/health'],
    createProxyMiddleware({
      target: 'http://localhost:3002',
      changeOrigin: true,
    })
  );

  // Static uploads (served by backend on port 3001)
  // Commented out since we moved the demo image to frontend public folder
  // app.use(
  //   '/uploads',
  //   createProxyMiddleware({
  //     target: 'http://localhost:3001',
  //     changeOrigin: true,
  //   })
  // );
};


