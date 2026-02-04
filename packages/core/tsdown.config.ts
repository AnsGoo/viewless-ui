import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: './src/index.ts',
  format: ['esm', 'umd', 'iife'],
  globalName: 'ViewlessCore',
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
