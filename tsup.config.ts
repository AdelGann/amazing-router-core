import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli.ts"],
  format: ["cjs", "esm"],
  clean: true,
  dts: true,
  minify: true,
  platform: "node",
  external: ["fs", "path"],
});
