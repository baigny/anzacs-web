/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      // Windows-only: raw fs.watch throws an unhandled EBUSY and kills the
      // dev server when a file in public/ is still mid-write (OneDrive sync,
      // antivirus scan). Polling avoids that; awaitWriteFinish waits out the lock.
      usePolling: true,
      awaitWriteFinish: { stabilityThreshold: 300, pollInterval: 100 },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["e2e/**", "node_modules/**"],
  },
});
