module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Modify source-map-loader configuration to ignore node_modules
      const oneOfRule = webpackConfig.module.rules.find(rule => rule.oneOf);
      if (oneOfRule) {
        const sourceMapRule = oneOfRule.oneOf.find(
          rule => rule.use && rule.use.some && rule.use.some(use => 
            use.loader && use.loader.includes('source-map-loader')
          )
        );
        
        if (sourceMapRule) {
          // Add an exclude pattern for node_modules
          sourceMapRule.exclude = /node_modules/;
        }
      }

      // Add fallback for source-map-loader to preRules
      const preRules = webpackConfig.module.rules.filter(rule => rule.enforce === 'pre');
      for (const rule of preRules) {
        if (rule.use && rule.use.some && rule.use.some(use => 
          use.loader && use.loader.includes('source-map-loader')
        )) {
          rule.exclude = /node_modules/;
        }
      }

      return webpackConfig;
    },
  },
  style: {
    postcss: {
      plugins: [
        require('postcss-flexbugs-fixes'),
        require('tailwindcss'),
        require('autoprefixer'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009',
          },
          stage: 3,
        }),
      ],
    },
  },
};
