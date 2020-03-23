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
        },
    ],
    commonjs: {
        namedExports: {
            'node_modules/react-dom/index.js': [
                'render',
                'unmountComponentAtNode',
            ],
            'node_modules/react/index.js': [
                'useRef',
                'useEffect',
                'useCallback',
                'useMemo',
                'useState',
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
    globalStyle: 'src/global/core-styles.scss',
    testing: {
        moduleNameMapper: {
            '^lodash-es$': 'lodash',
        },
    },
};
