import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

// Standalone vitest config (kept separate from the library vite.config so the
// dts/lib-build plugins don't run during tests). The cascade logic under test
// is pure, so the default 'node' environment is sufficient.
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
