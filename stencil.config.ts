import { Config } from '@stencil/core';
import { OutputTargetWww } from '@stencil/core/dist/declarations/output-targets';
import { sass } from '@stencil/sass';

const targetWww: OutputTargetWww = {
    type: 'www',
    serviceWorker: null,
    dir: '.docz/public/stencil',
    copy: [
        { src: 'dev-assets' },
        { src: 'examples/**/*.tsx' },
        { src: 'examples/**/*.scss' },
        { src: 'components/**/*.md' },
    ],
};

export const config: Config = {
    namespace: 'lime-elements',
    outputTargets: [targetWww],
    plugins: [sass()],
    tsconfig: './tsconfig.dev.json',
    globalStyle: 'src/global/colors.scss',
};
