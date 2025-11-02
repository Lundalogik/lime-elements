import fs from "fs";
export function exists(path) {
    return new Promise((resolve) => {
        fs.access(path, fs.constants.F_OK, (error) => {
            resolve(!error);
        });
    });
}
export function mkdir(path, options = {}) {
    return new Promise((resolve, reject) => {
        fs.mkdir(path, options, (error, path) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(path);
            }
        });
    });
}
export function readFile(path, options = 'utf8') {
    return new Promise((resolve, reject) => {
        fs.readFile(path, options, (error, data) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(data);
            }
        });
    });
}
export function writeFile(path, data, options = 'utf8') {
    // eslint-disable-next-line no-console
    console.log('[KOMPENDIUM:FS] writeFile called with path:', path);
    // eslint-disable-next-line no-console
    console.log('[KOMPENDIUM:FS] Data size:', data.length, 'bytes');
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, options, (error) => {
            if (error) {
                // eslint-disable-next-line no-console
                console.error('[KOMPENDIUM:FS] ERROR writing file to:', path, 'Error:', error);
                reject(error);
            }
            else {
                // eslint-disable-next-line no-console
                console.log('[KOMPENDIUM:FS] Successfully wrote file to:', path);
                resolve();
            }
        });
    });
}
export function stat(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (error, stats) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(stats);
            }
        });
    });
}
//# sourceMappingURL=filesystem.js.map
