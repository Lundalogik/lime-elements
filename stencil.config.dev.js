/* eslint-env es6 */

const less = require('@stencil/less');
const sass = require('@stencil/sass');

exports.config = {
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
