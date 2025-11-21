import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  // Allow CommonJS require() in JavaScript files (non-TypeScript)
  files: [
    "**/*.js",
    "**/*.cjs",
    "**/*.mjs"
  ],
  rules: {
    "@typescript-eslint/no-require-imports": "off",
    "@typescript-eslint/no-var-requires": "off",
  },
}, {
  // Cypress support files need triple-slash references
  files: ["cypress/support/**/*.ts"],
  rules: {
    "@typescript-eslint/triple-slash-reference": "off",
  },
}, {
  // Global rules for all files
  rules: {
    "@typescript-eslint/no-unused-vars": ["warn", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    "@typescript-eslint/no-explicit-any": "warn",
  },
}, {
  ignores: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ],
}];

export default eslintConfig;
