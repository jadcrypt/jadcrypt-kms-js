import babel from 'rollup-plugin-babel';

export default {
  entry: 'lib/index.js',
  dest: 'dist/jadcrypt-kms.es6.js',
  format: 'es6',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: ['es2016'],
      plugins: ['external-helpers']
    })
  ]
};
