import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { URL } from "url";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    css: true,
    coverage: { reporter: ["text", "html"] },
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
