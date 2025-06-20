import { defineConfig } from "tsup"

export default defineConfig([
  {
    entry: ["src/index.tsx"],
    external: ["react", "react-dom"],
    format: ["esm", "cjs"],
    clean: true,
    splitting: false,
    dts: true,
  },
])
