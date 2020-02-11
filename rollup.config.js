import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';

const ignoredWarnings = ['UNUSED_EXTERNAL_IMPORT']

const tsOpts = {
  cacheRoot: './node_modules/.rpt2',
  typescript: require('typescript'),
  tsconfig: 'tsconfig.json',
  tsconfigOverride: {
    compilerOptions: {
      // Don't emit declarations, that's done by the regular build.
      declaration: false,
      module: 'ESNext',
    }
  }
}

export default {
  input: 'src/index.ts',
  treeshake: { pureExternalModules: true },
  onwarn, // our source file
  output: [
    {
      file: `dist/node-toolkit/${pkg.module}`,
      format: 'esm'
    }
  ],
  external: ['path', 'assert', ...Object.keys(pkg.peerDependencies || {}),...Object.keys(pkg.dependencies || {})],
  plugins: [
    typescript(tsOpts),
    terser(), // minifies generated bundles
  ],
};

function onwarn(warning, next) {
  if (ignoredWarnings.includes(warning.code)) {
    return
  }

  next(warning)
}