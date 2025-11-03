import fs from 'fs';

export function exists(path: string): Promise<boolean> {
    return new Promise((resolve) => {
        fs.access(path, fs.constants.F_OK, (error) => {
            resolve(!error);
        });
    });
}

export function mkdir(path: string, options: any = {}): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.mkdir(path, options, (error, path) => {
            if (error) {
                reject(error);
            } else {
                resolve(path);
            }
        });
    });
}

export function copyFile(src: string, dest: string): Promise<void> {
    /* eslint-disable no-console */
    console.debug(
        '[KOMPENDIUM:FS] copyFile called with src:',
        src,
        'and dest:',
        dest,
    );

    return new Promise((resolve, reject) => {
        fs.copyFile(src, dest, (error) => {
            if (error) {
                console.error(
                    '[KOMPENDIUM:FS] ERROR copying file from:',
                    src,
                    'to:',
                    dest,
                    'Error:',
                    error,
                );
                reject(error);
            } else {
                console.debug(
                    '[KOMPENDIUM:FS] Successfully copied file from:',
                    src,
                    'to:',
                    dest,
                );
                resolve();
            }
        });
    });
    /* eslint-enable no-console */
}

export function readFile(path: string, options: any = 'utf8'): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(path, options, (error, data: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

export function writeFile(
    path: string,
    data: string,
    options: any = 'utf8',
): Promise<void> {
    /* eslint-disable no-console */
    console.debug('[KOMPENDIUM:FS] writeFile called with path:', path);
    console.debug('[KOMPENDIUM:FS] Data size:', data.length, 'bytes');

    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, options, (error) => {
            if (error) {
                console.error(
                    '[KOMPENDIUM:FS] ERROR writing file to:',
                    path,
                    'Error:',
                    error,
                );
                reject(error);
            } else {
                console.debug(
                    '[KOMPENDIUM:FS] Successfully wrote file to:',
                    path,
                );
                resolve();
            }
        });
    });
    /* eslint-enable no-console */
}

export function stat(path: string): Promise<fs.Stats> {
    return new Promise((resolve, reject) => {
        fs.stat(path, (error, stats) => {
            if (error) {
                reject(error);
            } else {
                resolve(stats);
            }
        });
    });
}
