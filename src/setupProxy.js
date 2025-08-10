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

  // Static uploads (served by backend on port 3001)
  app.use(
    '/uploads',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  );
};


