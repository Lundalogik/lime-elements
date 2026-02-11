import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { kompendium } from 'kompendium';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import guides from './guides';

export const config: Config = {
    hashFileNames: false,
    namespace: 'lime-elements',
    plugins: [
        sass({
            includePaths: ['node_modules'],
        }),
    ],
    rollupPlugins: {
        before: [nodeResolve()],
    },
    outputTargets: [
        {
            type: 'dist',
            copy: [{ src: 'style/' }],
        },
        {
            type: 'docs-custom',
            strict: true,
            generator: kompendium({
                typeRoot: './src/index.ts',
                guides: guides,
            }),
        },
        {
            type: 'www',
            serviceWorker: null,
            dir: 'www',
            copy: [
                { src: 'style/color-palette-extended.css' },
                {
                    src: 'test-assets/',
                    dest: 'assets/',
                },
                {
                    src: '../node_modules/kompendium/dist/',
                    dest: 'assets/kompendium/',
                },
                {
                    src: 'favicon.svg',
                    dest: 'favicon.svg',
                },
            ],
        },
    ],
    tsconfig: './tsconfig.dev.json',
    globalStyle: 'src/global/core-styles.scss',
    testing: {
        browserArgs: [
            '--enable-experimental-web-platform-features',
            // Disable GPU in CI to work around Stencil v4 e2e test parallelization issues
            // See: https://github.com/stenciljs/core/issues/6157
            ...(envIsSet('CI') ? ['--disable-gpu'] : []),
        ],
        setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
        moduleNameMapper: {
            '^lodash-es$': 'lodash',
            '@rjsf/core/lib/(.*)': '@rjsf/core/dist/cjs/$1',
        },
        // Include .js in transform to handle ESM packages
        transform: {
            '^.+\\.(ts|tsx|jsx|js|mjs|css)$':
                '<rootDir>/node_modules/@stencil/core/testing/jest-preprocessor.js',
        },
        // Transform ESM-only packages from the unified/remark/rehype ecosystem
        transformIgnorePatterns: [
            '/node_modules/(?!(' +
                'unified|bail|devlop|is-plain-obj|trough|vfile.*|' +
                'remark-.*|' +
                'rehype-.*|' +
                'mdast-util-.*|' +
                'hast-util-.*|hastscript|' +
                'unist-util-.*|' +
                'micromark.*|' +
                'decode-named-character-reference|' +
                'character-entities.*|' +
                'html-void-elements|' +
                'zwitch|' +
                'property-information|' +
                'space-separated-tokens|' +
                'comma-separated-tokens|' +
                'stringify-entities|' +
                'ccount|' +
                'escape-string-regexp|' +
                'markdown-table|' +
                'trim-lines|' +
                'longest-streak|' +
                'web-namespaces|' +
                'parse5|' +
                'entities' +
                ')/)',
        ],
    },
};

function envIsSet(name: string): boolean {
    const value = process.env[name];

    return !!value && value !== '0' && value.toLowerCase() !== 'false';
}
