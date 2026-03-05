import { access, constants } from "fs";
export function exists(path) {
    return new Promise((resolve) => {
        access(path, constants.F_OK, (error) => {
            resolve(!error);
        });
    });
}
//# sourceMappingURL=filesystem.js.map
