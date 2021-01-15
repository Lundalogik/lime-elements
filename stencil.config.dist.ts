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
            'node_modules/react/index.js': ['Component', 'forwardRef'],
        },
    },
    plugins: [sass()],
    buildEs5: 'prod',
    extras: {
        /* See docs at https://stenciljs.com/docs/config-extras */
        dynamicImportShim: true,
        shadowDomShim: true,
    },
    tsconfig: './tsconfig.dist.json',
    globalStyle: 'src/global/core-styles.scss',
};
