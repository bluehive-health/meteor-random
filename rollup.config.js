import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const pkg = require('./package.json');

const banner = `/**
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * 
 * @license ${pkg.license}
 * @author ${pkg.author}
 */`;

export default [
  // CommonJS build (for Node.js)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named',
      banner,
      sourcemap: true
    },
    plugins: [
      typescript({
        module: 'esnext',
        declaration: true,
        declarationDir: 'dist',
        target: 'ES2018'
      }),
      resolve(),
      commonjs()
    ],
    external: ['crypto'] // Don't bundle Node.js built-ins
  },

  // ES Module build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      banner,
      sourcemap: true
    },
    plugins: [
      typescript({
        module: 'esnext',
        declaration: false, // Already generated in CommonJS build
        target: 'ES2018'
      }),
      resolve(),
      commonjs()
    ],
    external: ['crypto']
  },

  // UMD build for browsers (unminified)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/browser.js',
      format: 'umd',
      name: 'BlueHiveRandom',
      exports: 'named',
      banner,
      sourcemap: true,
      globals: {
        crypto: 'crypto'
      },
      outro: 'if (typeof window !== "undefined") { window.Random = exports.Random; }'
    },
    plugins: [
      typescript({
        module: 'esnext',
        declaration: false,
        target: 'ES2018',
        lib: ['ES2018', 'DOM']
      }),
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs()
    ]
  },

  // UMD build for browsers (minified)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/browser.min.js',
      format: 'umd',
      name: 'BlueHiveRandom',
      exports: 'named',
      banner,
      sourcemap: true,
      globals: {
        crypto: 'crypto'
      },
      outro: 'if (typeof window !== "undefined") { window.Random = exports.Random; }'
    },
    plugins: [
      typescript({
        module: 'esnext',
        declaration: false,
        target: 'ES2018',
        lib: ['ES2018', 'DOM']
      }),
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      terser({
        output: {
          comments: function(node, comment) {
            const text = comment.value;
            const type = comment.type;
            if (type == "comment2") {
              // Preserve license comments
              return /@license/i.test(text);
            }
          }
        }
      })
    ]
  }
];
