import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { less } from '@stencil/less';

export const config: Config = {
    copy: [
        { src: 'dev-assets' },
        { src: 'examples/**/*.tsx' },
        { src: 'components/**/*.md' },
    ],
    namespace: 'lime-elements',
    outputTargets: [
        {
            type: 'www',
            serviceWorker: false,
            dir: '.docz/public/stencil',
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
};
