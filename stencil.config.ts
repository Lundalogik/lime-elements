import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
    namespace: 'lime-elements',
    outputTargets: [
        {
            type: 'dist',
        },
    ],
    plugins: [
        sass(),
    ],
    excludeSrc: ['/test/', '**/.spec.', '**/examples/**', '**/dev-assets/**'],
};
