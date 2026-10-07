import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const path = (name: string) => fileURLToPath(new URL(name, import.meta.url));
export default defineConfig({
  root: path('./pages'),
  base: process.env.PAGES_BASE_PATH || '/panther-classroom/',
  publicDir: path('./public'),
  resolve: { alias: [
    { find: '@/lib/classroom-storage', replacement: path('./pages/storage.ts') },
    { find: '@', replacement: path('./') },
  ] },
  plugins: [react()],
  build: { outDir: path('./dist-pages'), emptyOutDir: true },
});
