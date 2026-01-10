import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: './src/index.ts',
  format: 'esm',
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
