import { defineConfig } from "vite";
export default defineConfig({
  esbuild: { jsx: "automatic" },
  resolve: { conditions: ["development"], dedupe: ["react", "react-dom"] },
  server: {
    proxy: {
      "/docs": { target: "https://darwinui.mintlify.site", changeOrigin: true },
    },
  },
});
