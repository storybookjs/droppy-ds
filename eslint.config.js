import js from '@eslint/js'
import storybook from 'eslint-plugin-storybook'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

import svelteConfig from './svelte.config.js'

export default tseslint.config(
  {
    ignores: [
      '**/dist',
      '**/build',
      '**/node_modules',
      '**/storybook-static',
      '.claude',
      '.svelte-kit',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs.recommended,
  ...storybook.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx,svelte,mjs}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'svelte/no-unused-props': ['error', { ignorePropertyPatterns: ['/^aria-/'] }],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: ['.svelte'],
        parser: tseslint.parser,
        svelteConfig,
      },
    },
    rules: {
      // Icon markup is a static, package-owned string table, never user input.
      'svelte/no-at-html-tags': 'off',
      // Prop-less story fixtures declare `let {}: Record<string, unknown> = $props()`
      // so a plain CSF `render` can hand them the story's args.
      'no-empty-pattern': 'off',
    },
  },
  {
    // The AST walkers work against oxc-parser's untyped ESTree output, so `any`
    // is the honest type here rather than a shortcut.
    files: ['tools/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  ...svelte.configs.prettier,
  prettier
)
