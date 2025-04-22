// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // default, unless you changed it
  },
  base: '/', // important: use "/" unless hosting under a subpath
});
