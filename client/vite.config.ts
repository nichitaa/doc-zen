import { defineConfig } from 'vite';
import { ViteAliases } from 'vite-aliases';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ViteAliases({})],
  resolve: {
    alias: [
      {
        find: /^~/,
        replacement: '',
      },
    ],
  },
  root: './',
  build: {
    outDir: 'dist',
  },
  publicDir: 'public',
  define: {
    'process.env': process.env,
  },
});
