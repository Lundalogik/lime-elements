import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { kompendium } from 'kompendium';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import type { Plugin } from 'rollup';

import guides from './guides';

// Stencil's bundled @rollup/plugin-commonjs crashes during watch-mode
// rebuilds on stale cache metadata. This hook runs first and tells
// Rollup to use the cached transform for any module whose source is
// unchanged, which is always correct during a dev watch session.
function commonjsCacheFix(): Plugin {
    return {
        name: 'commonjs-cache-fix',
        shouldTransformCachedModule() {
            return false;
        },
    };
}

export const config: Config = {
    hashFileNames: false,
    namespace: 'lime-elements',
    plugins: [
        sass({
            includePaths: ['node_modules'],
        }),
    ],
    rollupPlugins: {
        before: [commonjsCacheFix(), nodeResolve()],
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
