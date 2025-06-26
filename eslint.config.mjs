import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import sonarjs from 'eslint-plugin-sonarjs';
import preferArrow from 'eslint-plugin-prefer-arrow';
import ban from 'eslint-plugin-ban';
import tsdoc from 'eslint-plugin-tsdoc';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const compat = new FlatCompat({
    baseDirectory: dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    {
        ignores: [
            '**/.kompendium/',
            '**/.github/',
            '**/.vscode/',
            '**/dist/',
            '**/docsDist/',
            '**/node_modules/',
            '**/www/',
            '**/chrome-headless-shell/',
        ],
    },
    ...compat.extends(
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:prettier/recommended',
    ),
    sonarjs.configs.recommended,
    {
        plugins: {
            '@typescript-eslint': typescriptEslint,
            prettier: prettier,
            'prefer-arrow': preferArrow,
            ban: ban,
            tsdoc: tsdoc,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
            },

            parser: tsParser,
            ecmaVersion: 2020,
            sourceType: 'module',
        },

        settings: {
            react: {
                version: '16.14',
                pragma: 'h',
            },
        },

        rules: {
            quotes: [
                'error',
                'single',
                {
                    avoidEscape: true,
                },
            ],

            semi: ['error', 'always'],
            'prettier/prettier': 'error',

            '@typescript-eslint/array-type': [
                'error',
                {
                    default: 'array-simple',
                },
            ],

            '@typescript-eslint/consistent-type-assertions': 'error',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/prefer-for-of': 'error',
            '@typescript-eslint/prefer-function-type': 'error',
            '@typescript-eslint/unified-signatures': 'error',
            '@typescript-eslint/no-unused-expressions': 'error',
            'no-unused-vars': 'off',
            camelcase: 'error',
            'comma-dangle': 'off',
            curly: 'error',
            'default-case': 'error',
            eqeqeq: ['error', 'always'],
            'guard-for-in': 'error',
            'id-match': 'error',
            'max-classes-per-file': ['error', 1],
            'multiline-ternary': ['error', 'never'],
            'no-bitwise': 'error',
            'no-caller': 'error',
            'no-console': 'error',
            'no-duplicate-imports': 'error',
            'no-eval': 'error',
            'no-extra-bind': 'error',

            'no-magic-numbers': [
                'error',
                {
                    ignore: [-1, 0, 1],
                    ignoreArrayIndexes: true,
                },
            ],

            'no-new-func': 'error',
            'no-new-wrappers': 'error',
            'no-return-await': 'error',
            'no-sequences': 'error',
            'no-shadow': 'off',

            '@typescript-eslint/no-shadow': [
                'error',
                {
                    hoist: 'all',
                },
            ],

            'no-template-curly-in-string': 'error',
            'no-throw-literal': 'error',
            'no-underscore-dangle': 'error',
            'no-var': 'error',
            'object-shorthand': ['error', 'never'],
            'one-var': ['error', 'never'],

            'padding-line-between-statements': [
                'error',
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'return',
                },
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'function',
                },
                {
                    blankLine: 'always',
                    prev: 'multiline-block-like',
                    next: '*',
                },
            ],

            'prefer-arrow/prefer-arrow-functions': [
                'error',
                {
                    allowStandaloneDeclarations: true,
                },
            ],

            'prefer-const': 'error',
            'prefer-object-spread': 'error',
            radix: 'error',
            'sonarjs/deprecation': 'warn',
            'sonarjs/function-return-type': 'off',
            'sonarjs/no-invalid-await': 'off', // This rule gives lots of false positives.
            'sonarjs/no-invariant-returns': 'warn',
            'sonarjs/no-nested-assignment': 'warn',
            'sonarjs/no-selector-parameter': 'warn',
            'sonarjs/no-skipped-tests': 'warn',
            'sonarjs/no-unused-vars': 'off', // We use the TypeScript rule instead.
            'sonarjs/object-alt-content': 'warn',
            'sonarjs/prefer-regexp-exec': 'warn',
            'sonarjs/public-static-readonly': 'warn',
            'sonarjs/todo-tag': 'off',
            'sonarjs/use-type-alias': 'warn',

            'spaced-comment': [
                'error',
                'always',
                {
                    markers: ['/'],
                },
            ],

            'no-restricted-imports': [
                'error',
                {
                    name: '@limetech/lime-elements',
                    message:
                        'Production code should not import from `@limetech/lime-elements`. Please import from a relative path instead.',
                },
                {
                    name: 'lodash',
                    message:
                        'Import from lodash-es instead. This will reduce the bundle size.',
                },
                {
                    name: 'underscore',
                    message:
                        'This project uses lodash instead of underscore. Please import from lodash-es instead. This will reduce the bundle size.',
                },
            ],

            'tsdoc/syntax': 'warn',
        },
    },
    {
        files: ['*.js'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },

        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
            'no-unused-vars': 'error',
            'sonarjs/no-duplicate-string': 'off',
        },
    },
    {
        files: ['./*.ts'],

        rules: {
            'sonarjs/no-duplicate-string': 'off',
        },
    },
    {
        files: ['src/**/*.{ts,tsx}'],

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: 'script',

            parserOptions: {
                parserOption: {
                    jsx: true,
                },

                project: 'tsconfig.json',
            },
        },

        rules: {
            '@typescript-eslint/dot-notation': 'error',
        },
    },
    {
        files: [
            'src/examples/*.{ts,tsx}',
            'src/**/examples/*.{ts,tsx}',
            'src/**/examples/**/*.{ts,tsx}',
            'src/**/*.spec.{ts,tsx}',
            'src/**/*.e2e.{ts,tsx}',
            'src/**/*.test-wrapper.{ts,tsx}',
        ],

        languageOptions: {
            ecmaVersion: 5,
            sourceType: 'script',

            parserOptions: {
                parserOption: {
                    jsx: true,
                },

                project: 'tsconfig.lint.json',
            },
        },

        rules: {
            '@typescript-eslint/dot-notation': 'error',
            'sonarjs/no-duplicate-string': 'off',
            'sonarjs/no-identical-functions': 'off',
            'sonarjs/no-nested-functions': 'off',
            'no-console': 'off',
            'no-magic-numbers': 'off',
            'prefer-arrow/prefer-arrow-functions': 'off',

            'ban/ban': [
                'error',
                {
                    name: ['describe', 'only'],
                    message: "don't focus tests",
                },
                {
                    name: 'fdescribe',
                    message: "don't focus tests",
                },
                {
                    name: ['it', 'only'],
                    message: "don't focus tests",
                },
                {
                    name: 'fit',
                    message: "don't focus tests",
                },
                {
                    name: ['test', 'only'],
                    message: "don't focus tests",
                },
                {
                    name: 'ftest',
                    message: "don't focus tests",
                },
            ],

            'no-restricted-imports': [
                'error',
                {
                    name: 'lodash',
                    message:
                        'Import from lodash-es instead. This will reduce the bundle size.',
                },
                {
                    name: 'underscore',
                    message:
                        'This project uses lodash instead of underscore. Please import from lodash-es instead. This will reduce the bundle size.',
                },
            ],
        },
    },
    {
        files: [
            'src/**/*.spec.{ts,tsx}',
            'src/**/*.e2e.{ts,tsx}',
            'src/**/*.test-wrapper.{ts,tsx}',
        ],

        rules: {
            'sonarjs/no-clear-text-protocols': 'off',
        },
    },
];
