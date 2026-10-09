import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.js', 'test/**/*.js', 'e2e/**/*.mjs'],
    languageOptions: { globals: globals.node },
  },
  { files: ['public/**/*.js'], languageOptions: { globals: globals.browser } },
];
