const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env }) => {
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
      return webpackConfig;
    },
  },
};


