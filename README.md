# Monorepo package with Multiple Entry points with tsup

[WIP]

## Why multiple entry points?

https://preconstruct.tools/guides/when-should-i-use-multiple-entrypoints/

https://web.archive.org/web/20230831133354/https://preconstruct.tools/guides/when-should-i-use-multiple-entrypoints/

## How?

- Native support for multiple entry points in node.js via the "exports" field in package.json
- but the above does not work within monorepos or with typescript

Solution?

- Create "proxy" packages that point to the actual files
