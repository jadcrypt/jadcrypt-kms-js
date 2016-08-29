import babel from 'rollup-plugin-babel';

export default {
  entry: 'lib/cli.js',
  dest: 'bin/jadcrypt-kms',
  format: 'cjs',
  banner: '#!/usr/bin/env node',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: [['es2015', { modules: false }]],
      plugins: ['external-helpers']
    })
  ]
};
