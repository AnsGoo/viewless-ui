import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: './src/index.ts',
  format: ['esm', 'umd', 'iife'],
  globalName: 'ViewlessUI',
  dts: {
    sourcemap: true,
  },
  platform: 'browser',
  external: ['vue', '@viewless-ui/core'],
  outDir: 'dist',
  exports: {
    devExports: 'development',
  },
});
