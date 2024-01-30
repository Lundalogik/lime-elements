/* eslint-env node */
module.exports = {
    env: {
        browser: true,
        es2020: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:prettier/recommended',
        'plugin:sonarjs/recommended',
        'plugin:jsdoc/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'prettier',
        'sonarjs',
        'jsdoc',
        'prefer-arrow',
        'ban',
    ],
    settings: {
        react: {
            version: '16.14',
            pragma: 'h',
        },
    },
    rules: {
        quotes: ['error', 'single', { avoidEscape: true }],
        semi: ['error', 'always'],
        'prettier/prettier': 'error',
        '@typescript-eslint/no-unused-vars': [
            'error',
            { varsIgnorePattern: '^h$' },
        ],
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
        'comma-dangle': 'off', // prettier takes care of this
        curly: 'error',
        'default-case': 'error',
        eqeqeq: ['error', 'always'],
        'guard-for-in': 'error',
        'id-match': 'error',
        'jsdoc/check-indentation': 'error',
        'jsdoc/require-jsdoc': 'off',
        'jsdoc/no-undefined-types': 'off',
        'jsdoc/check-tag-names': 'off',
        'jsdoc/tag-lines': ['error', 'always', { count: 0, startLines: 1 }],
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
            { blankLine: 'always', prev: '*', next: 'return' },
            { blankLine: 'always', prev: '*', next: 'function' },
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
    },
    overrides: [
        {
            files: ['./*.js'],
            rules: {
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
            parser: '@typescript-eslint/parser',
            parserOptions: {
                parserOption: {
                    jsx: true,
                },
                project: 'tsconfig.json',
            },
            rules: {
                '@typescript-eslint/dot-notation': 'error',
            },
        },
        {
            files: [
                'src/examples/*.{ts,tsx}',
                'src/components/**/examples/*.{ts,tsx}',
                'src/components/**/examples/**/*.{ts,tsx}',
                'src/**/*.spec.{ts,tsx}',
                'src/**/*.e2e.{ts,tsx}',
                'src/**/*.test-wrapper.{ts,tsx}',
            ],
            parserOptions: {
                parserOption: {
                    jsx: true,
                },
                project: 'tsconfig.lint.json',
            },
            rules: {
                '@typescript-eslint/dot-notation': 'error',
                'sonarjs/no-duplicate-string': 'off',
                'sonarjs/no-identical-functions': 'off',
                'jsdoc/require-returns': 'off',
                'jsdoc/require-param': 'off',
                'no-console': 'off',
                'no-magic-numbers': 'off',
                'prefer-arrow/prefer-arrow-functions': 'off',
                'ban/ban': [
                    'error',
                    {
                        name: ['describe', 'only'],
                        message: "don't focus tests",
                    },
                    { name: 'fdescribe', message: "don't focus tests" },
                    { name: ['it', 'only'], message: "don't focus tests" },
                    { name: 'fit', message: "don't focus tests" },
                    { name: ['test', 'only'], message: "don't focus tests" },
                    { name: 'ftest', message: "don't focus tests" },
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
    ],
};
