import { Config } from '@stencil/core';
import { OutputTargetWww } from '@stencil/core/dist/declarations/output-targets';
import { sass } from '@stencil/sass';

const targetWww: OutputTargetWww = {
    type: 'www',
    serviceWorker: null,
    dir: '.docz/dist/stencil',
    baseUrl: '/lime-elements/',
};

export const config: Config = {
    copy: [
        { src: 'dev-assets' },
        { src: 'examples/**/*.tsx' },
        { src: 'examples/**/*.scss' },
        { src: 'components/**/*.md' },
    ],
    hashFileNames: false,
    namespace: 'lime-elements',
    outputTargets: [targetWww],
    plugins: [sass()],
    globalScript: 'src/global/index.ts',
    globalStyle: 'src/global/colors.scss',
};
