import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  // TODO:
  format: ["cjs", "esm"],
  clean: true,
  dts: true,
});
