import js from '@eslint/js';
import ts from 'typescript-eslint';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default defineConfig([
  globalIgnores(['dist']),
  {
    extends: [
      js.configs.recommended,
      ts.configs.recommended,
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.recommended,
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },
]);
