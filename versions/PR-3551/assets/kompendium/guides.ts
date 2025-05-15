import glob from 'glob';
import { basename, dirname, resolve } from 'path';
import { markdownToHtml } from './markdown';
import { readFile } from './filesystem';

export interface KompendiumGuide {
    dirPath?: string;
    fileName?: string;
    filePath?: string;
    data: Record<string, any>;
    content: string;
}

export async function findGuides(): Promise<KompendiumGuide[]> {
    return new Promise((resolve) => {
        glob('./src/**/*.md', {}, async (_, files) => {
            const guides = await Promise.all<KompendiumGuide>(
                files.map(createGuide)
            );
            resolve(guides.filter(hasPath));
        });
    });
}

export async function createGuide(filepath: string): Promise<KompendiumGuide> {
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

export function hasPath(guide: KompendiumGuide): boolean {
    if (typeof guide?.data?.frontmatter !== 'object') {
        return false;
    }

    return 'path' in guide.data.frontmatter;
}
