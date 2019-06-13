import { Config } from '@stencil/core';
import { OutputTargetWww } from '@stencil/core/dist/declarations/output-targets';
import { sass } from '@stencil/sass';

const targetWww: OutputTargetWww = {
    type: 'www',
    serviceWorker: null,
    dir: '.docz/dist/stencil',
    copy: [
        { src: 'dev-assets' },
        { src: 'examples/**/*.tsx' },
        { src: 'examples/**/*.scss' },
        { src: 'components/**/*.md' },
    ],
};

// Target used for initally copying output into the
// docz dist folder, to avoid having to build twice.
const targetTmp: OutputTargetWww = {
    ...targetWww,
    dir: '.tmp',
};

export const config: Config = {
    hashFileNames: false,
    namespace: 'lime-elements',
    outputTargets: [targetWww, targetTmp],
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
