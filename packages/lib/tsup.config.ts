import { defineConfig } from "tsup";
import { setupMultipleEntryPoints } from "multiple-entry";

const entryPoints = ["src/index.ts", "src/utils/index.ts"];

export default defineConfig({
  entryPoints,
  dts: true,
  clean: true,
  format: ["cjs", "esm"],
  onSuccess: async () => {
    await setupMultipleEntryPoints(entryPoints);
  },
});
