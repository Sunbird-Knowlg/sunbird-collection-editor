import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src'] }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CollectionEditorReact',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) =>
        format === 'umd'
          ? 'collection-editor.umd.js'
          : format === 'es'
          ? 'index.js'
          : 'index.cjs',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Category-definition lives on a separate backend in dev (9000) and is
      // served without the /action prefix. Must be listed BEFORE the generic
      // '/action' rule so it wins the longest-prefix match.
      '/action/object/category/definition': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/action/, ''),
      },
      '/action': { target: 'http://localhost:3000', changeOrigin: true },
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
      '/content': { target: 'http://localhost:3000', changeOrigin: true },
      '/assets': { target: 'http://localhost:3000', changeOrigin: true },
      '/learner': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
