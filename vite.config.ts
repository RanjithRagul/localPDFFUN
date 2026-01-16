import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    // Use relative base path to ensure assets load correctly on GitHub Pages
    // regardless of the repository name (e.g. /repo-name/ or root domain)
    base: '/localPDFFUN/',

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    plugins: [react()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },

    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});