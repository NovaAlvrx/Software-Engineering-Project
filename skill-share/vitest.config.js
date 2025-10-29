import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,              // enables "test" and "expect"
    environment: "jsdom",       // simulates browser DOM
    setupFiles: "./src/setupTests.js",  // for jest-dom
  },
});