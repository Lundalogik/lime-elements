const ncp = require('ncp');
const fs = require('fs');

/**
 * Waits for a path to exist
 */
function waitForPath(path) {
    return new Promise(resolve => {
        const TIMEOUT = 1000;
        const id = setInterval(() => {
            fs.access(path, fs.constants.F_OK, err => {
                if (err) {
                    console.error(err);
                    return;
                }

                clearInterval(id);
                resolve(path);
            });
        }, TIMEOUT);
    });
}

/**
 *
 */
function copyFiles(path) {
    const src = 'src/icons';
    const dest = `${path}/assets/icons`;

    console.log(`Copying ${src} to ${dest}...`);
    fs.mkdirSync(`${path}/assets`);

    ncp(src, dest, error => {
        if (error) {
            console.error(error);
            return;
        }

        console.log('Done!');
    });
}

const env = process.env.NODE_ENV || 'dev';
const paths = {
    prod: 'dist/collection',
    dev: '.docz/public/stencil',
};
const basePath = paths[env];

let delay = 0;
if (env === 'dev') {
    // In dev mode, we cannot wait for the build to finish since it runs "forever"
    // However, we cannot start the copying before the build has started, so we need to
    // wait a few seconds before starting
    delay = 5000;
}

setTimeout(() => {
    waitForPath(basePath).then(copyFiles);
}, delay);
