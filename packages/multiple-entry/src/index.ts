import dedent from "dedent";
import fs from "fs-extra";
import path from "path";

type Exports = Record<
  string,
  | {
      import?: string;
      require: string;
      types?: string;
      default: string;
    }
  | string
>;

const generatePackageExports = async (entryPoints: Array<string>) => {
  const exports: Exports = {};

  for (const file of entryPoints) {
    /**
     * Example: src/index, src/utils/index
     */
    const fileWithoutExtension = file.replace(path.extname(file), "");

    /**
     * Example: ., ./utils
     */
    const name = fileWithoutExtension
      .replace(/^src\//g, "./")
      .replace(/\/index$/, "");

    /**
     * Example: ./dist/index.js, ./dist/utils/index.js
     */
    const distSourceFile = `${fileWithoutExtension.replace(
      /^src\//g,
      "./dist/"
    )}.js`;

    /**
     * Example: ./dist/index.mjs, ./dist/utils/index.mjs
     */
    const distSourceFileEs = `${fileWithoutExtension.replace(
      /^src\//g,
      "./dist/"
    )}.mjs`;

    /**
     * Example: ./dist/index.d.ts, ./dist/utils/index.d.ts
     */
    const distTypesFile = `${fileWithoutExtension.replace(
      /^src\//g,
      "./dist/"
    )}.d.ts`;

    exports[name] = {
      ...((await fs.pathExists(distTypesFile)) ? { types: distTypesFile } : {}),
      ...((await fs.pathExists(distSourceFileEs))
        ? { import: distSourceFileEs }
        : {}),
      require: distSourceFile,
      default: distSourceFile,
    };
  }

  exports["./package.json"] = "./package.json";

  const packageJson = await fs.readJson("package.json");
  packageJson.exports = exports;
  await fs.writeFile(
    "package.json",
    JSON.stringify(packageJson, null, 2) + "\n"
  );

  return exports;
};

const generateProxyPackages = async (exports: Exports) => {
  const ignorePaths: Array<string> = [];
  const files = new Set<string>();
  for (const [filePath, value] of Object.entries(exports)) {
    if (
      filePath === "." ||
      filePath === "./package.json" ||
      typeof value === "string"
    )
      continue;

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

    // Replace "./" with ""
    ignorePaths.push(filePath.replace(/^\.\//g, ""));

    const file = filePath.replace(/^\.\//g, "").split("/")[0];
    if (!file || files.has(file)) continue;
    files.add(`/${file}`);
  }

  files.add("/dist");
  const packageJson = await fs.readJSON("package.json");
  packageJson.files = [...files.values()];
  await fs.writeFile(
    "package.json",
    JSON.stringify(packageJson, null, 2) + "\n"
  );

  if (ignorePaths.length === 0) return;
  await fs.outputFile(
    ".gitignore",
    dedent`
    # Generated file. Do not edit directly.

    ${ignorePaths.join("/**\n")}/**
  `
  );
};

export const setupMultipleEntryPoints = async (entryPoints: Array<string>) => {
  const exports = await generatePackageExports(entryPoints);

  await generateProxyPackages(exports);
};
