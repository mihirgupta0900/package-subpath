import { defineConfig } from "tsup";
import path from "path";
import fs from "fs-extra";
import dedent from "dedent";

type Exports = Record<
  string,
  {
    import: string;
    require: string;
    types: string;
  }
>;

const getPackageExports = async (entryPoints: Array<string>) => {
  // const exports = {};

  // for (const file of entryPoints) {
  //   const filenameWithoutExtension = file.replace(path.extname(file), "");
  // }

  const packageJson = await fs.readJson("package.json");

  return packageJson.exports as Exports;
};

const generateProxyPackages = async (exports: Exports) => {
  for (const [filePath, value] of Object.entries(exports)) {
    if (filePath === "." || filePath === "./package.json") continue;

    await fs.ensureDir(filePath);
    const entryExists = await fs.pathExists(value.require);
    if (!entryExists) {
      throw new Error(`Entry point ${value.require} does not exist`);
    }

    const entryPoint = path.relative(filePath, value.require);

    await fs.outputFile(
      `${filePath}/package.json`,
      dedent`
      {
        "type": "module",
        "main": "${entryPoint}"
      }
      `
    );
  }
};

const entryPoints = ["src/index.ts", "src/utils/index.ts"];

export default defineConfig({
  entryPoints,
  dts: true,
  clean: true,
  format: ["cjs", "esm"],
  onSuccess: async () => {
    const exports = await getPackageExports(entryPoints);

    await generateProxyPackages(exports);
  },
});
