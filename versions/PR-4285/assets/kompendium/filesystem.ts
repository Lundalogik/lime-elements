import { access, constants } from 'fs';

export function exists(path: string): Promise<boolean> {
    return new Promise((resolve) => {
        access(path, constants.F_OK, (error) => {
            resolve(!error);
        });
    });
}
