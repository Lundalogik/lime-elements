/* eslint-env es6 */

const less = require('@stencil/less');
const sass = require('@stencil/sass');

exports.config = {
    namespace: 'lime-elements',
    outputTargets: [
        {
            type: 'dist',
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
    excludeSrc: ['/test/', '**/.spec.', '**/examples/**', '**/dev-assets/**'],
};
