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
                typeRoot: './src/interface.ts',
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
        moduleNameMapper: {
            '^lodash-es$': 'lodash',
            '@rjsf/core/lib/(.*)': '@rjsf/core/dist/cjs/$1',
        },
    },
};
