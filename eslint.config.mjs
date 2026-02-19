import { defineConfig, globalIgnores } from 'eslint/config';
import config from '@limetech/eslint-config';

export default defineConfig([
    globalIgnores(['.claude', '.kompendium', 'api-extractor.json', 'docsDist']),
    ...config,
    {
        files: ['**/*.{ts,tsx}'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            'jsdoc/require-returns': 'off',
            'jsdoc/require-param-description': 'off',
            'unicorn/no-array-reverse': 'off', // Requires Typescript 5.2 or higher, and build target es2023.
        },
    },
    {
        files: ['**/*.{spec,e2e,vspec,ve2e}.{ts,tsx}'],
        rules: {
            'sonarjs/no-clear-text-protocols': 'off',
        },
    },
    {
        // Match @limetech/eslint-config test file overrides for .vspec/.ve2e
        files: ['**/*.{vspec,ve2e}.{ts,tsx}'],
        rules: {
            'sonarjs/no-duplicate-string': 'off',
            'sonarjs/no-identical-functions': 'off',
            'sonarjs/no-nested-functions': 'off',
            'sonarjs/no-skipped-tests': 'off',
            'sonarjs/pseudo-random': 'off',
            'no-console': 'off',
            'no-magic-numbers': 'off',
            camelcase: 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'unicorn/prefer-structured-clone': 'off',
        },
    },
]);
