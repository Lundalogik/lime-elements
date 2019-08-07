import { Config } from '@stencil/core';
import {
    OutputTargetDist,
    OutputTargetWww,
} from '@stencil/core/dist/declarations/output-targets';
import { sass } from '@stencil/sass';

const targetDist: OutputTargetDist = {
    type: 'dist',
    copy: [{ src: 'style/' }, { src: 'assets/' }],
};

const targetWww: OutputTargetWww = {
    type: 'www',
    serviceWorker: null,
    dir: '.docz/public/stencil',
    copy: [
        { src: 'examples/**/*.tsx' },
        { src: 'examples/**/*.scss' },
        { src: 'components/**/*.md' },
    ],
};

export const config: Config = {
    hashFileNames: false,
    namespace: 'lime-elements',
    outputTargets: [targetDist, targetWww],
    plugins: [sass()],
    excludeSrc: [
        '**/test/**',
        '**/*.spec.*',
        '**/*.e2e.*',
        '**/*.test-wrapper.*',
    ],
    tsconfig: './tsconfig.dev.json',
    globalStyle: 'src/global/colors.scss',
};
