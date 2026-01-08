import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: './src/index.ts',
  format: 'esm',
  dts: {
    sourcemap: true,
  },
  external: ['vue', '@viewless/core'],
  outDir: 'dist',
});
