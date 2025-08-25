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
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      all: false,
      cleanOnRerun: true,
      exclude: [
        // build & config
        "postcss.config.mjs",
        "next.config.ts",
        "prisma/seed.ts",
        // storybook scaffolding
        "src/stories/**",
        "src/components/**/*.stories.*",
        // pages we don’t unit test (can cover with Playwright later)
        "src/app/layout.tsx",
        "src/app/page.tsx",
        "src/app/docs/**",
        "src/app/debug/**",
        // prisma client bootstrap (side-effect module)
        "src/lib/db.ts",
      ],
    },
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
