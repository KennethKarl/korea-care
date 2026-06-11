import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// base: served from "/korea-care/" on GitHub Pages (build only); root "/" for local dev.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/korea-care/" : "/",
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
}));
