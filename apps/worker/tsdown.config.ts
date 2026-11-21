import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  platform: "node",
  target: "node20",
  clean: true,
  sourcemap: true,
  // Workspace packages export raw TypeScript, so they must be compiled into the bundle.
  // Every other dependency stays external and is installed on the server.
  deps: { alwaysBundle: [/^@hookrelay\//] },
});
