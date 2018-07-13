const less = require('@stencil/less');
const sass = require('@stencil/sass');

exports.config = {
    copy: [
        { src: 'dev-assets' },
        { src: 'examples/**/*.tsx' },
        { src: 'components/**/*.md' },
        { src: '../node_modules/codemirror', dest: 'lib/codemirror' }
    ],
    namespace: 'lime-elements',
    outputTargets:[
        {
            dir: 'www-dev',
            type: 'www',
            serviceWorker: false
        }
    ],
    plugins: [
        less({
            injectGlobalPaths: ['node_modules/lime-less-variables/src/lime-less-variables.less']
        }),
        sass()
    ]
};
