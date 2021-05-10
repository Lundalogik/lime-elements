import { basename, dirname, resolve } from 'path';
import { readFile } from './filesystem';
import { KompendiumGuide, KompendiumConfig, Guide } from '../types';

export async function findGuides(
    config: Partial<KompendiumConfig>
): Promise<KompendiumGuide[]> {
    const nodes = config.guides.map(createMenuNode('/')).flat();
    const promises = nodes.map(createGuide);

    return Promise.all(promises);
}

interface MenuNode {
    menupath: string;
    filepath: string;
}

export const createMenuNode = (path: string) => (
    guide: Guide
): MenuNode | MenuNode[] => {
    if (typeof guide !== 'string') {
        const newPath = path + guide.name + '/';

        return guide.children.map(createMenuNode(newPath)).flat();
    }

    return {
        menupath: path,
        filepath: guide,
    };
};

export const createGuide = async ({
    menupath: path,
    filepath,
}: MenuNode): Promise<KompendiumGuide> => {
    const content = await readFile(filepath);

    return {
        dirPath: dirname(filepath),
        fileName: basename(filepath),
        filePath: resolve(filepath),
        data: {
            path: path + basename(filepath),
        },
        content: content,
    };
};
