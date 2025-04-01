import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './src/shared'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@styles': path.resolve(__dirname, './src/shared/styles'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/app/setup-tests.ts',
  },
});
