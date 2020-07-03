import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import doczStarter from './rollup-plugin-docz-starter';

export const config: Config = {
    hashFileNames: false,
    namespace: 'lime-elements',
    outputTargets: [
        {
            type: 'dist',
            copy: [{ src: 'style/' }],
        },
        {
            type: 'www',
            serviceWorker: null,
            dir: 'www',
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
    tsconfig: './tsconfig.dev.json',
    globalStyle: 'src/global/core-styles.scss',
    testing: {
        moduleNameMapper: {
            '^lodash-es$': 'lodash',
        },
    },
};
