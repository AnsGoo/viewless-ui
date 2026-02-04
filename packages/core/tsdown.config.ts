import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: './src/index.ts',
  format: {
    esm: {},
    umd: {
      name: 'ViewlessCore',
      globalName:'ViewlessCore',
    },
    iife: {
      name: 'ViewlessCore',
      globalName:'ViewlessCore',
    },
  },
  dts: {
    sourcemap: true,
  },
  platform: 'browser',
  external: ['vue'],
  outDir: 'dist',
  exports: {
    devExports: 'development',
  },
});
