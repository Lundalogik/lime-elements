const less = require('@stencil/less');

exports.config = {
  namespace: 'lime-elements',
  outputTargets:[
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: false
    }
  ],
  plugins: [
    less({
      injectGlobalPaths: ['node_modules/lime-less-variables/src/lime-less-variables.less']
    })
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
