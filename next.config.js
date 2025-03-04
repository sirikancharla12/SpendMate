const { resolve } = require('path');
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
  },
});

// module.exports = require(resolve('./next.config.ts'));
module.exports = {
  reactStrictMode: true,
};

