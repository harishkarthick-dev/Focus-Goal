import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Ignore Firebase SDK minified files
    'node_modules/@firebase/**',
    'node_modules/firebase/**',
    // Ignore generated PWA workbox files
    'public/**',
    // Ignore coverage reports
    'coverage/**',
  ]),
  {
    rules: {
      // Allow unused vars with underscore prefix
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      // Allow @ts-ignore with description
      '@typescript-eslint/ban-ts-comment': [
        'warn',
        {
          'ts-ignore': 'allow-with-description',
          'ts-expect-error': 'allow-with-description',
        },
      ],
      // Disable some React rules that are too strict
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
]);

export default eslintConfig;
