import js from "@eslint/js";
import ts from "typescript-eslint";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-plugin-prettier";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    plugins: {
      prettier,
    },
    extends: [
      js.configs.recommended,
      ts.configs.recommended,
      reactHooks.configs.flat["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      ...prettier.configs.recommended.rules,
    },
  },
]);
