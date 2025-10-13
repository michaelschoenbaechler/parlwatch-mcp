import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Base TS/JS recommended
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Node environment for backend/shared packages
  {
    files: ['packages/server/**/*.{ts,js,mjs,cjs}', 'packages/shared/**/*.{ts,js}'],
    languageOptions: { globals: { ...globals.node } }
  },
  // Browser (React) environment for UI
  {
    files: ['packages/ui/**/*.{ts,tsx,js,jsx}'],
    languageOptions: { globals: { ...globals.browser } }
  }
]);
