import glob from 'glob';
import { basename, dirname, resolve } from 'path';
import { markdownToHtml } from './markdown';
import { readFile } from './filesystem';
export async function findGuides() {
    return new Promise((resolve) => {
        glob('./src/**/*.md', {}, async (_, files) => {
            const guides = await Promise.all(files.map(createGuide));
            resolve(guides.filter(hasPath));
        });
    });
}
export async function createGuide(filepath) {
    const content = await readFile(filepath);
    const file = await markdownToHtml(content);
    return {
        dirPath: dirname(filepath),
        fileName: basename(filepath),
        filePath: resolve(filepath),
        data: file.data,
        content: content,
    };
}
export function hasPath(guide) {
    var _a;
    if (typeof ((_a = guide === null || guide === void 0 ? void 0 : guide.data) === null || _a === void 0 ? void 0 : _a.frontmatter) !== 'object') {
        return false;
    }
    return 'path' in guide.data.frontmatter;
}
