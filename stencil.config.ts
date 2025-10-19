import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { kompendium } from 'kompendium';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import guides from './guides';

export const config: Config = {
    hashFileNames: false,
    namespace: 'lime-elements',
    plugins: [sass()],
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
                // Points to dist/types to leverage Stencil's auto-generated
                // components.d.ts which includes all component prop types.
                // NOTE: In dev mode (npm start), examples import from
                // '@limetech/lime-elements' which creates circular imports
                // in dist/types/components.d.ts, resulting in incomplete docs.
                // For production docs, use `npm run docs:build` which builds
                // dist with stencil.config.dist.ts first (excludes examples).
                typeRoot: './dist/types/index.d.ts',
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
        browserArgs: ['--enable-experimental-web-platform-features'],
        moduleNameMapper: {
            '^lodash-es$': 'lodash',
            '@rjsf/core/lib/(.*)': '@rjsf/core/dist/cjs/$1',
        },
    },
};
