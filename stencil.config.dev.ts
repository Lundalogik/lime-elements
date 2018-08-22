import { Config } from '@stencil/core';
import { OutputTargetWww } from '@stencil/core/dist/declarations/output-targets';
import { sass } from '@stencil/sass';
import { less } from '@stencil/less';

const targetWww: OutputTargetWww = {
    type: 'www',
    serviceWorker: null,
    dir: '.docz/public/stencil',
};

export const config: Config = {
    copy: [
        { src: 'dev-assets' },
        { src: 'examples/**/*.tsx' },
        { src: 'components/**/*.md' },
    ],
    namespace: 'lime-elements',
    outputTargets: [
        targetWww,
    ],
    plugins: [
        less({
            injectGlobalPaths: [
                'node_modules/lime-less-variables/src/lime-less-variables.less',
            ],
        }),
        sass(),
    ],
};
