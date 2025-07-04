import type { Config } from "tailwindcss"

export default {
  content: ["src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    preflight: false,
  },
} satisfies Config
