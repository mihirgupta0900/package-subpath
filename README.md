# TSUP Subpath Exports

This library helps you export multiple entrypoints in a tsup package

## Usage

This library exports the function `setupMultipleEntryPoints`, which takes in an array of entrypoints. This is the same input taken by the `entrypoints` key in `defineConfig`

```ts
import { defineConfig } from "tsup"
import { setupMultipleEntryPoints } from "tsup-subpath-exports"

const entryPoints = ["src/index.ts", "src/extras/index.ts"]

export default defineConfig({
  entryPoints,
  onSuccess: async () => {
    await setupMultipleEntryPoints(entryPoints)
  },
})
```
