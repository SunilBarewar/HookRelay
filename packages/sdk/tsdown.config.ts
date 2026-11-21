import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/webhooks.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  target: "es2022",
});
