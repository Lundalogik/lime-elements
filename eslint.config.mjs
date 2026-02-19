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
        files: ['**/*.{spec,e2e}.{ts,tsx}'],
        rules: {
            'sonarjs/no-clear-text-protocols': 'off',
        },
    },
]);
