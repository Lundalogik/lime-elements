import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export const config: Config = {
    namespace: 'lime-elements',
    outputTargets: [
        {
            type: 'dist',
            copy: [
                { src: 'style/' },
                { src: 'style/mixins.scss', dest: '../scss/mixins.scss' },
            ],
        },
    ],
    plugins: [sass()],
    rollupPlugins: {
        after: [nodePolyfills()],
    },
    tsconfig: './tsconfig.dist.json',
    globalStyle: 'src/global/core-styles.scss',
};
