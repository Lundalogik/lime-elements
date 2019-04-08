import { Config } from '@stencil/core';
import { OutputTargetDist } from '@stencil/core/dist/declarations/output-targets';
import { sass } from '@stencil/sass';

const targetDist: OutputTargetDist = {
    type: 'dist',
    copy: [{ src: 'style/' }, { src: 'assets/' }],
};

export const config: Config = {
    namespace: 'lime-elements',
    outputTargets: [targetDist],
    plugins: [sass()],
    excludeSrc: [
        '**/test/**',
        '**/examples/**',
        '**/dev-assets/**',
        '**/*.spec.*',
        '**/*.e2e.*',
        '**/*.test-wrapper.*',
    ],
    globalStyle: 'src/global/colors.scss',
};
