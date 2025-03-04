import { defineConfig } from "vite";
export default defineConfig({
  base: "/duckegghunt/",
  mode: "development",
  server: {
    open: true,
    port: 2900,
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "",
    minify: false,
    emptyOutDir: true,
    copyPublicDir: true,
    chunkSizeWarningLimit: 2048,
  },
  publicDir: "assets",
});
