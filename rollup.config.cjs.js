import babel from 'rollup-plugin-babel';

export default {
  entry: 'lib/index.js',
  dest: 'dist/jadcrypt-kms.js',
  format: 'cjs',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: [['es2015', { modules: false }]],
      plugins: ['external-helpers']
    })
  ]
};
