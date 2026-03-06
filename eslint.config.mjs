import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  // Override React version to avoid eslint-plugin-react auto-detection via
  // deprecated context.getFilename() API removed in ESLint 10.
  settings: {
    react: {
      version: "19",
    },
  },
}, {
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
      "varsIgnorePattern": "^_",
      "caughtErrorsIgnorePattern": "^_"
    }],
    "@typescript-eslint/no-explicit-any": "warn",
    // Temporarily enable strict React Hooks rules from v7 to see violations
    "react-hooks/immutability": "error",
    "react-hooks/purity": "error",
    "react-hooks/set-state-in-effect": "error",
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
