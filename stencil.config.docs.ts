import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
    hashFileNames: false,
    namespace: 'lime-elements',
    outputTargets: [
        {
            type: 'www',
            serviceWorker: null,
            dir: '.docz/dist/stencil',
            baseUrl: '/',
            copy: [
                { src: 'components/**/examples/**/*.tsx' },
                { src: 'components/**/examples/**/*.scss' },
                { src: 'components/**/*.md' },
            ],
        },
    ],
    commonjs: {
        namedExports: {
            'node_modules/react-dom/index.js': [
                'render',
                'unmountComponentAtNode',
            ],
        },
    },
    plugins: [sass()],
    excludeSrc: [
        '**/test/**',
        '**/*.spec.*',
        '**/*.e2e.*',
        '**/*.test-wrapper.*',
    ],
    globalStyle: 'src/global/core-styles.scss',
};
