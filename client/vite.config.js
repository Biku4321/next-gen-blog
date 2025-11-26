import path from "path";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
      jsxImportSource: "react",
      babel: {
        plugins: ["@babel/plugin-transform-react-jsx"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@services": path.resolve(__dirname, "src/services")
    },
  },
  server: {
    host: true, // ✅ Allows access from network/Docker
    port: 5173,
    strictPort: true,
    open: true,
    // ✅ FIX: Proxy API requests to the Backend
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});