import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["src/tests/service-worker/**/*.js", "public/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  // Enforce canonical types import usage
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          "paths": [
            { "name": "./types", "message": "Import types from the canonical barrel `@/types` or `@/types/<domain>` instead." },
            { "name": "../types", "message": "Import types from the canonical barrel `@/types` or `@/types/<domain>` instead." }
          ],
          "patterns": ["./**/types", "../**/types"]
        }
      ]
    }
  }
  ,
  // Allow intentionally-local types within certain internal utility modules
  {
    files: ["src/utils/serviceWorker/**", "src/utils/time/**"],
    rules: {
      "no-restricted-imports": "off"
    }
  }
];

export default eslintConfig;
