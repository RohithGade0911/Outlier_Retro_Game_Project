import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Outlier_Retro_Game_Project/',
  server: {
    host: true,
    port: 5173
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
}); 