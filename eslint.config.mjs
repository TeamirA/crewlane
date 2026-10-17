import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const sizeLimits = {
  "max-lines": ["error", { max: 200, skipBlankLines: true, skipComments: true }],
  "max-len": ["error", { code: 100, ignoreUrls: true, ignoreStrings: true }],
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      ...sizeLimits,
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      "max-lines-per-function": ["error", { max: 30, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ["**/*.tsx"],
    rules: {
      "max-lines-per-function": ["error", { max: 150, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ["tests/**", "prisma/**", "**/*.config.*"],
    rules: { "max-lines-per-function": "off" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"]),
]);

export default eslintConfig;
