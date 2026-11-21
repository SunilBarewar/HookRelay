import { defineConfig } from "vitest/config";

/**
 * One Vitest for the whole monorepo. Every workspace folder below is its own project, so a
 * package only needs `*.test.ts` files to be picked up. Add a `vitest.config.ts` inside a
 * package only if it needs custom settings (e.g. a path alias).
 */
export default defineConfig({
  test: {
    projects: ["packages/*", "apps/*", "examples/*"],
    passWithNoTests: true,
  },
});
