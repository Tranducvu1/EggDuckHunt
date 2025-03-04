import { defineConfig } from "vite";
import del from 'rollup-plugin-delete';

export default defineConfig({
  root: './src', // Đặt thư mục gốc là src
  base: './', 
  mode: "production", 
  server: {
    open: true,
    port: 2900,
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: '../dist', // Build ra ngoài thư mục dist gốc
    assetsDir: 'assets', 
    minify: true, 
    emptyOutDir: true,
    copyPublicDir: true,
    chunkSizeWarningLimit: 2048, 
  },
  publicDir: '../public', // Nếu bạn có thư mục public
});