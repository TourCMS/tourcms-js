import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'index.js',
  output: {
    name: 'TourCMSWrapper',
    file: './dist/index.js',
    format: 'umd',
    exports: 'named',
  },
  plugins: [nodeResolve(), commonjs(), json()]
};