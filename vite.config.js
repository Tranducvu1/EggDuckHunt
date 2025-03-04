import { defineConfig } from "vite";
import del from 'rollup-plugin-delete';

export default defineConfig({
  plugins: [
    del({ targets: ["dist/*"], ignore: ["dist/assets"], runOnce: true }),
    del({ targets: ["dist/*"], ignore: ["dist/assets", "dist/index"], runOnce: true, hook: "buildEnd" }),
  ],
  base: "./", // Change base to relative path for Vercel
  mode: "production", // Change to production for deployment
  server: {
    open: true,
    port: 2900,
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: "dist",
    assetsDir: "assets", // Specify assets directory
    minify: true, // Enable minification for production
    emptyOutDir: true,
    copyPublicDir: true,
    chunkSizeWarningLimit: 2048, // 2MB chunk size warning
  },
  publicDir: "assets", // This will copy the assets folder to the dist folder
});
