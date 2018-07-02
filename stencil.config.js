/* eslint-env es6 */

const less = require('@stencil/less');
const sass = require('@stencil/sass');

exports.config = {
    copy: [{ src: 'dev-assets' }],
    namespace: 'lime-elements',
    outputTargets: [
        {
            type: 'dist',
        },
        {
            type: 'www',
            serviceWorker: false,
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
