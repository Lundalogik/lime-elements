import { JsonDocs } from '@stencil/core/internal';
import { KompendiumConfig, defaultConfig, KompendiumData } from './config';
import { addSources } from './source';
import lnk from 'lnk';
import { createMenu } from './menu';
import { exists, mkdir, readFile, writeFile } from './filesystem';
import { createWatcher } from './watch';
import { findGuides } from './guides';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const kompendium = (config: Partial<KompendiumConfig> = {}) => {
    if (!generateDocs()) {
        return () => null;
    }

    return kompendiumGenerator(config);
};

export function kompendiumGenerator(
    config: Partial<KompendiumConfig>
): (docs: JsonDocs) => Promise<void> {
    config = {
        ...defaultConfig,
        ...config,
    };
    initialize(config);

    return async (docs: JsonDocs) => {
        const guides = await findGuides();
        const data: KompendiumData = {
            docs: await addSources(docs),
            title: await getProjectTitle(config),
            menu: createMenu(docs, guides),
            readme: await getReadme(),
            guides: guides,
        };

        await writeData(config, data);
    };
}

async function initialize(config: Partial<KompendiumConfig>) {
    const path = `${config.publicPath}/kompendium.json`;

    if (isWatcher()) {
        createWatcher(path, 'unlink', onUnlink(config));
    }
}

const onUnlink = (config: Partial<KompendiumConfig>) => () => {
    createSymlink(config);
};

async function createSymlink(config: Partial<KompendiumConfig>) {
    const source = `${config.path}/kompendium.json`;
    const target = `${config.publicPath}/kompendium.json`;

    if (!(await exists(source))) {
        return;
    }

    if (await exists(target)) {
        return;
    }

    lnk([source], config.publicPath);
}

async function getProjectTitle(
    config: Partial<KompendiumConfig>
): Promise<string> {
    if (config.title) {
        return config.title;
    }

    const json = await readFile('./package.json');
    const data = JSON.parse(json);

    return data.name
        .replace(/^@[^/]+?\//, '')
        .split('-')
        .join(' ');
}

async function writeData(
    config: Partial<KompendiumConfig>,
    data: KompendiumData
) {
    const filePath = `${config.path}/kompendium.json`;

    if (!(await exists(config.path))) {
        mkdir(config.path, { recursive: true });
    }

    await writeFile(filePath, JSON.stringify(data));
    createSymlink(config);
}

async function getReadme(): Promise<string> {
    const files = ['readme.md', 'README.md', 'README', 'readme'];
    let data = null;

    for (const file of files) {
        if (data) {
            continue;
        }

        if (!(await exists(file))) {
            console.log(`${file} did not exist`);
            continue;
        }

        data = await readFile(file);
    }

    return data;
}

function generateDocs(): boolean {
    return !!process.argv.find((arg) => arg === '--docs');
}

function isWatcher(): boolean {
    return !!process.argv.find((arg) => arg === '--watch');
}
