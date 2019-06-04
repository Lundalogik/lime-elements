const shell = require('shelljs');
const distDir = '.docz/dist';

cleanOld();
build();
run();

function cleanOld() {
    shell.rm('-rf', distDir);
}

function build() {
    // dev-build required for the readme.md for
    // each component to be created. /Ads
    if (shell.exec('npm run dev').code !== 0) {
        shell.echo('dev failed!');
        shell.exit(1);
    }

    if (shell.exec('npm run docz:build:dev').code !== 0) {
        shell.echo('docz:build:dev failed!');
        shell.exit(1);
    }
}

function run() {
    const httpServerPwa = require('http-server-pwa');
    httpServerPwa(distDir, {
        port: 3000,
        fallback: 'index.html',
    });
}
