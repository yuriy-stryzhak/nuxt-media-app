// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import eslintPluginVue from 'eslint-plugin-vue';

export default withNuxt(
  [
    {
      files: ['**/*.vue', '**/*.js', '**/*.ts'], // Files to lint

      languageOptions: {
        parserOptions: {
          ecmaVersion: 2021,
          sourceType: 'module',
        },
        globals: {
          defineNuxtConfig: 'readonly', // Declare Nuxt global function
        },
      },

      plugins: {
        vue: eslintPluginVue, // Add Vue plugin
      },

      rules: {
        // General rules
        semi: 'error', // Always use semicolons
        'prefer-const': 'error', // Prefer const for variables that are not reassigned
        'no-unused-vars': 'warn', // Warn about unused variables
        'no-undef': 'error', // Error for undefined variables
        eqeqeq: ['error', 'always'], // Require === and !==
        'no-console': 'warn', // Warn for console.log
        'no-debugger': 'error', // Disallow debugger
        curly: ['error', 'all'], // Always use curly braces for blocks
        'arrow-parens': ['error', 'always'], // Require parentheses around arrow function arguments
        'no-var': 'error', // Disallow var
        'prefer-arrow-callback': 'error', // Prefer arrow functions for callbacks
        'no-multiple-empty-lines': ['error', { max: 1 }], // Allow only one empty line

        // TypeScript rules
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'warn',

        // Vue rules
        'vue/html-self-closing': [
          'error',
          {
            html: {
              void: 'always',
              normal: 'never',
              component: 'always',
            },
            svg: 'always',
            math: 'always',
          },
        ],
        'vue/max-attributes-per-line': [
          'error',
          {
            singleline: 1,
            multiline: 1,
          },
        ],
        'vue/require-default-prop': 'off',
        'vue/no-v-html': 'off',
        'vue/multi-word-component-names': 'off',
      },
    },
  ]
);
