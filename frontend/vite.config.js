import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path: '/' for local dev, '/DH-pagepulse/' for GitHub Pages
const base = process.env.GITHUB_PAGES ? '/DH-pagepulse/' : '/';

export default defineConfig({
  plugins: [react()],
  base,
  server: {
    port: 5173,
    // Proxy /api/* requests to backend in development
    // This avoids CORS issues locally and means no env var needed for dev
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
