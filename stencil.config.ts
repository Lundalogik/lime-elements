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
            copy: [
                { src: 'style/' },

                // Deprecated legacy paths for consumers still using
                // direct imports like `dist/scss/mixins` or
                // `dist/lime-elements/scss/mixins`.
                // Use `@use '@limetech/lime-elements'` instead.
                { src: 'style/mixins.scss', dest: 'scss/mixins.scss' },
                {
                    src: 'style/mixins.scss',
                    dest: '../scss/mixins.scss',
                },
            ],
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
};
