import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  // TODO:
  format: ["cjs", "esm"],
  clean: true,
  dts: true,
  banner: {
    js: `
// https://github.com/evanw/esbuild/issues/1921#issuecomment-1491470829
import { fileURLToPath } from 'url';
import { createRequire as topLevelCreateRequire } from 'module';
const require = topLevelCreateRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
    `,
  },
});
