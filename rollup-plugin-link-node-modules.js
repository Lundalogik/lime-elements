/* eslint-disable no-undef */
const lnk = require('lnk');
const fs = require('fs');

const TIMEOUT = 500;

module.exports = function linkNodeModules() {
    return {
        name: 'link-node-modules',
        generateBundle: async () => {
            while (!fs.existsSync('www')) {
                await new Promise((resolve) => setTimeout(resolve, TIMEOUT));
            }

            if (!fs.existsSync('www/node_modules')) {
                lnk(['node_modules'], 'www');
            }
        },
    };
};
