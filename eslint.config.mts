import { defineConfig } from 'eslint/config';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const js = require('@eslint/js') as typeof import('@eslint/js');
const globals = require('globals') as typeof import('globals');
const tseslint = require('typescript-eslint') as typeof import('typescript-eslint');

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
