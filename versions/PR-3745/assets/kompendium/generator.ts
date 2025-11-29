import { JsonDocs, Config, Logger } from '@stencil/core/internal';
import { defaultConfig } from './config';
import { addSources } from './source';
import lnk from 'lnk';
import { createMenu } from './menu';
import { copyFile, mkdir, readFile, stat, writeFile } from 'fs/promises';
import { exists } from './filesystem';
import { createWatcher } from './watch';
import { findGuides } from './guides';
import { KompendiumConfig, KompendiumData, TypeDescription } from '../types';
import { parseFile } from './typedoc';
import { createSchemas } from './schema';
import { createIndex } from './search';

export const kompendium = (config: Partial<KompendiumConfig> = {}) => {
    if (!generateDocs()) {
        return () => null;
    }

    return kompendiumGenerator(config);
};

let logger: Logger;

export function kompendiumGenerator(
    config: Partial<KompendiumConfig>,
): (docs: JsonDocs, stencilConfig: Config) => Promise<void> {
    config = {
        ...defaultConfig,
        ...config,
    };
    initialize(config);

    return async (docs: JsonDocs, stencilConfig: Config) => {
        logger = stencilConfig.logger;
        const timeSpan = logger.createTimeSpan('kompendium started');

        const [jsonDocs, title, readme, guides, types] = await Promise.all([
            addSources(docs),
            getProjectTitle(config),
            getReadme(),
            findGuides(config),
            getTypes(config),
        ]);

        const data: KompendiumData = {
            docs: jsonDocs,
            title: title,
            logo: config.logo,
            menu: createMenu(docs, guides, types),
            readme: readme,
            guides: guides,
            types: types,
            schemas: createSchemas(docs.components, types),
            index: null,
        };

        data.index = createIndex(data);

        await writeData(config, data);

        timeSpan.finish('kompendium finished');
    };
}

async function initialize(config: Partial<KompendiumConfig>) {
    const path = `${config.publicPath}/kompendium.json`;

    if (isWatcher()) {
        createWatcher(path, 'unlink', onUnlink(config));
    }

    await createOutputDirs(config);
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
    config: Partial<KompendiumConfig>,
): Promise<string> {
    if (config.title) {
        return config.title;
    }

    const json = await readFile('./package.json', 'utf8');
    const data = JSON.parse(json);

    return data.name
        .replace(/^@[^/]+?\//, '')
        .split('-')
        .join(' ');
}

async function writeData(
    config: Partial<KompendiumConfig>,
    data: KompendiumData,
) {
    // Always write to the kompendium config folder (typically `.kompendium` in
    // the root of the project) to avoid Stencil deleting the file during build.
    const filePath = `${config.path}/kompendium.json`;

    await writeFile(filePath, JSON.stringify(data), 'utf8');

    if (isProd()) {
        // In production, we used to write the kompendium.json file to the
        // public path. We now copy the file to the public path for backwards
        // compatibility with projects that do not have problems with Stencil
        // deleting the file during build. For projects that do have this
        // problem, they can always copy the file from the config folder.
        const publicFilePath = `${config.publicPath}/kompendium.json`;
        if (!(await exists(config.publicPath))) {
            await mkdir(config.publicPath, { recursive: true });
        }

        await copyFile(filePath, publicFilePath);
    }

    if (isWatcher()) {
        createSymlink(config);
    }
}

async function createOutputDirs(config: Partial<KompendiumConfig>) {
    let path = config.path;
    if (!(await exists(path))) {
        mkdir(path, { recursive: true });
    }

    path = config.publicPath;
    if (!(await exists(path))) {
        mkdir(path, { recursive: true });
    }
}

async function getReadme(): Promise<string> {
    const files = ['readme.md', 'README.md', 'README', 'readme'];
    let data = null;

    for (const file of files) {
        if (data) {
            continue;
        }

        if (!(await exists(file))) {
            continue;
        }

        data = await readFile(file, 'utf8');
    }

    if (!data) {
        logger.warn('README did not exist');
    }

    return data;
}

function generateDocs(): boolean {
    return !!process.argv.includes('--docs');
}

function isWatcher(): boolean {
    return !!process.argv.includes('--watch');
}

function isProd(): boolean {
    return !(
        process.argv.includes('--dev') ||
        process.argv.includes('test') ||
        process.argv.find((arg) => arg.includes('jest-worker'))
    );
}

async function getTypes(
    config: Partial<KompendiumConfig>,
): Promise<TypeDescription[]> {
    logger.debug('Getting type information...');
    let types = await readTypes(config);
    const cache = await readCache(config);

    if (types.length === 0 || (await isModified(types, cache))) {
        logger.debug('Parsing types...');
        const data = parseFile(config.typeRoot);
        await saveData(config, data);
        types = data;
    }

    return types;
}

async function isModified(types: any[], cache: Record<string, number>) {
    if (Object.keys(cache).length === 0) {
        return true;
    }

    let filenames = types.map((t) => t.sources).flat();
    filenames = [...new Set(filenames)];

    const stats = await Promise.all(filenames.map(stat));

    return stats.some((data, index) => {
        const filename = filenames[index];
        const result = cache[filename] !== data.mtimeMs;

        logger.debug(`${filename} was ${result ? '' : 'not'} modified!`);

        return result;
    });
}

async function saveData(
    config: Partial<KompendiumConfig>,
    types: TypeDescription[],
) {
    let filenames = types.map((t) => t.sources).flat();
    filenames = [...new Set(filenames)];

    const stats = await Promise.all(filenames.map(stat));

    const cache = {};
    stats.forEach((data, index) => {
        const filename = filenames[index];
        cache[filename] = data.mtimeMs;
    });

    await Promise.all([writeCache(config, cache), writeTypes(config, types)]);
}

async function readCache(config: Partial<KompendiumConfig>) {
    try {
        const data = await readFile(`${config.path}/cache.json`, 'utf8');

        return JSON.parse(data);
    } catch {
        return {};
    }
}

async function writeCache(config: Partial<KompendiumConfig>, data: any) {
    await writeFile(`${config.path}/cache.json`, JSON.stringify(data), 'utf8');
}

async function readTypes(config: Partial<KompendiumConfig>) {
    try {
        const data = await readFile(`${config.path}/types.json`, 'utf8');

        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function writeTypes(config: Partial<KompendiumConfig>, data: any) {
    await writeFile(`${config.path}/types.json`, JSON.stringify(data), 'utf8');
}
