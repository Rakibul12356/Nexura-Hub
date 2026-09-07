import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react-redux/es/index.js": path.resolve(__dirname, "./node_modules/react-redux/dist/react-redux.mjs"),
      "react-redux/es": path.resolve(__dirname, "./node_modules/react-redux/dist/react-redux.mjs"),
    },
  },
  optimizeDeps: {
    include: ["react-redux", "react", "react-dom", "react-router-dom"],
  },
  server: {
    port: 5173,
    open: true,
  },
});
