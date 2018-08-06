import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { less } from '@stencil/less';

export const config: Config = {
    namespace: 'lime-elements',
    outputTargets: [
        {
            type: 'dist',
        },
    ],
    plugins: [
        less({
            injectGlobalPaths: [
                'node_modules/lime-less-variables/src/lime-less-variables.less',
            ],
        }),
        sass(),
    ],
    excludeSrc: ['/test/', '**/.spec.', '**/examples/**', '**/dev-assets/**'],
};
