import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
    namespace: 'lime-elements',
    outputTargets: [
        {
            type: 'dist',
            copy: [{ src: 'style/' }],
        },
    ],
    plugins: [sass()],
    tsconfig: './tsconfig.dist.json',
    globalStyle: 'src/global/core-styles.scss',
};
