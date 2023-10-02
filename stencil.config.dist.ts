import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { nodeResolve } from '@rollup/plugin-node-resolve';

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
        before: [nodeResolve()],
    },
    tsconfig: './tsconfig.dist.json',
    globalStyle: 'src/global/core-styles.scss',
};
