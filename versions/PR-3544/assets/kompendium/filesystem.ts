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
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, options, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
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
