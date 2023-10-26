import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:4441",
    },
  },
  build: {
    outDir: "build",
  },
  plugins: [react()],
});
