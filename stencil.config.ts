import { Config } from '@stencil/core';
import {
    OutputTargetDist,
    OutputTargetWww,
} from '@stencil/core/dist/declarations/output-targets';
import { sass } from '@stencil/sass';
import doczStarter from './rollup-plugin-docz-starter';

const targetDist: OutputTargetDist = {
    type: 'dist',
    copy: [{ src: 'style/' }],
};

const targetWww: OutputTargetWww = {
    type: 'www',
    serviceWorker: null,
    dir: '.docz/public/stencil',
    copy: [
        { src: 'components/**/examples/**/*.tsx' },
        { src: 'components/**/examples/**/*.scss' },
        { src: 'components/**/*.md' },
        {
            src: '../node_modules/@lundalogik/lime-icons8/assets/',
            dest: 'assets/',
        },
    ],
};

export const config: Config = {
    hashFileNames: false,
    namespace: 'lime-elements',
    outputTargets: [targetDist, targetWww],
    commonjs: {
        namedExports: {
            'node_modules/react-dom/index.js': [
                'render',
                'unmountComponentAtNode',
            ],
        },
    },
    plugins: [sass(), doczStarter()],
    excludeSrc: [
        '**/test/**',
        '**/*.spec.*',
        '**/*.e2e.*',
        '**/*.test-wrapper.*',
    ],
    tsconfig: './tsconfig.dev.json',
    globalStyle: 'src/global/colors.scss',
    testing: {
        moduleNameMapper: {
            '^lodash-es$': 'lodash',
        },
    },
};
