import { Config } from '@stencil/core';
import { OutputTargetDist } from '@stencil/core/dist/declarations/output-targets';
import { sass } from '@stencil/sass';

const targetDist: OutputTargetDist = {
    type: 'dist',
};

export const config: Config = {
    copy: [{ src: 'style/' }],
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
    globalScript: 'src/global/index.ts',
    globalStyle: 'src/global/colors.scss',
};
