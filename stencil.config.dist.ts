import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
    namespace: 'lime-elements',
    outputTargets: [
        {
            type: 'dist',
            copy: [{ src: 'style/' }],
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
        '**/examples/**',
        '**/dev-assets/**',
        '**/*.spec.*',
        '**/*.e2e.*',
        '**/*.test-wrapper.*'   
    ],
    globalStyle: 'src/global/core-styles.scss',
};
