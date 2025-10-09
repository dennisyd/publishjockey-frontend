const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      if (env === 'production') {
        // Disable sourcemaps in production to avoid exposing code in public artifacts
        webpackConfig.devtool = false;

        // Ensure minimizer drops console and debugger in production builds
        if (
          webpackConfig.optimization &&
          Array.isArray(webpackConfig.optimization.minimizer)
        ) {
          webpackConfig.optimization.minimizer = webpackConfig.optimization.minimizer.map(
            (minimizer) => {
              const isTerser = minimizer && minimizer.constructor && minimizer.constructor.name === 'TerserPlugin';
              if (!isTerser) return minimizer;
              return new TerserPlugin({
                parallel: true,
                extractComments: false,
                terserOptions: {
                  compress: {
                    drop_console: true,
                    drop_debugger: true,
                  },
                  format: {
                    comments: false,
                  },
                },
              });
            }
          );
        } else {
          webpackConfig.optimization = {
            ...webpackConfig.optimization,
            minimize: true,
            minimizer: [
              new TerserPlugin({
                parallel: true,
                extractComments: false,
                terserOptions: {
                  compress: { drop_console: true, drop_debugger: true },
                  format: { comments: false },
                },
              }),
            ],
          };
        }
      }

      // Fix for webpack dev server allowedHosts issue
      if (env === 'development') {
        // Remove any existing devServer config that might be causing issues
        delete webpackConfig.devServer;
        
        // Set allowedHosts directly in the webpack config
        webpackConfig.devServer = {
          allowedHosts: 'all',
          host: 'localhost',
          port: 3000,
          hot: true,
          liveReload: true,
          client: {
            webSocketURL: 'ws://localhost:3000/ws',
          },
        };
      }

      return webpackConfig;
    },
  },
};


