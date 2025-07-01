import { defineConfig, globalIgnores } from 'eslint/config';
import config from '@limetech/eslint-config';

export default defineConfig([
    globalIgnores(['.kompendium', 'api-extractor.json']),
    ...config,
    {
        files: ['**/*.{ts,tsx}'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            'jsdoc/require-returns': 'off',
            'jsdoc/require-param-description': 'off',
        },
    },
    {
        files: ['**/*.{spec,e2e}.{ts,tsx}'],
        rules: {
            'sonarjs/no-clear-text-protocols': 'off',
        },
    },
]);
