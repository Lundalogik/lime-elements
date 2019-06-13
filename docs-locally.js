const shell = require('shelljs');
const argv = require('yargs').argv;

const runServer = argv.noServe === undefined;

const buildDev = !!argv.buildDev;
const watch = !!argv.watch;

const distDir = '.docz/dist';

if (buildDev) {
    buildDevFn();
}
if (runServer) {
    runServerFn();
}

function buildDevFn() {
    if (!watch) {
        shell.exec('npm run dev');
    }

    shell.exec('npx docz build');

    if (!watch) {
        shell.mkdir('.docz/dist/stencil');
        shell.cp('-R', '.tmp/*', '.docz/dist/stencil/');
    }
}

function runServerFn() {
    const httpServerPwa = require('http-server-pwa');
    httpServerPwa(distDir, {
        port: 3000,
        fallback: 'index.html',
    });
}
