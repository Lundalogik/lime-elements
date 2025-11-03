import { defaultConfig } from "./config";
import { addSources } from "./source";
import lnk from "lnk";
import { createMenu } from "./menu";
import { copyFile, exists, mkdir, readFile, writeFile, stat, } from "./filesystem";
import { createWatcher } from "./watch";
import { findGuides } from "./guides";
import { parseFile } from "./typedoc";
import { createSchemas } from "./schema";
import { createIndex } from "./search";
export const kompendium = (config = {}) => {
    if (!generateDocs()) {
        return () => null;
    }
    return kompendiumGenerator(config);
};
let logger;
export function kompendiumGenerator(config) {
    config = {
        ...defaultConfig,
        ...config,
    };
    initialize(config);
    return async (docs, stencilConfig) => {
        logger = stencilConfig.logger;
        const timeSpan = logger.createTimeSpan('kompendium started');
        // eslint-disable-next-line no-console
        console.debug('[KOMPENDIUM] Generator starting with config:', JSON.stringify(config, null, 2));
        // eslint-disable-next-line no-console
        console.debug('[KOMPENDIUM] process.argv:', process.argv);
        const [jsonDocs, title, readme, guides, types] = await Promise.all([
            addSources(docs),
            getProjectTitle(config),
            getReadme(),
            findGuides(config),
            getTypes(config, stencilConfig.tsconfig),
        ]);
        const data = {
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
async function initialize(config) {
    const path = `${config.publicPath}/kompendium.json`;
    if (isWatcher()) {
        createWatcher(path, 'unlink', onUnlink(config));
    }
    await createOutputDirs(config);
}
const onUnlink = (config) => () => {
    createSymlink(config);
};
async function createSymlink(config) {
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
async function getProjectTitle(config) {
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
async function writeData(config, data) {
    var _a;
    // eslint-disable-next-line no-console
    console.debug('[KOMPENDIUM] writeData called');
    // eslint-disable-next-line no-console
    console.debug('[KOMPENDIUM] config.path:', config.path);
    // eslint-disable-next-line no-console
    console.debug('[KOMPENDIUM] config.publicPath:', config.publicPath);
    // eslint-disable-next-line no-console
    console.debug('[KOMPENDIUM] isProd():', isProd());
    // Always write to the kompendium config folder (typically `.kompendium` in
    // the root of the project) to avoid Stencil deleting the file during build.
    const filePath = `${config.path}/kompendium.json`;
    // eslint-disable-next-line no-console
    console.debug('[KOMPENDIUM] Writing to filePath:', filePath);
    // eslint-disable-next-line no-console
    console.debug('[KOMPENDIUM] Data contains', ((_a = data.types) === null || _a === void 0 ? void 0 : _a.length) || 0, 'types');
    await writeFile(filePath, JSON.stringify(data));
    // eslint-disable-next-line no-console
    console.debug('[KOMPENDIUM] Successfully wrote kompendium.json to:', filePath);
    if (isProd()) {
        // In production, we used to write the kompendium.json file to the
        // public path. We now copy the file to the public path for backwards
        // compatibility with projects that do not have problems with Stencil
        // deleting the file during build. For projects that do have this
        // problem, they can always copy the file from the config folder.
        const publicFilePath = `${config.publicPath}/kompendium.json`;
        await copyFile(filePath, publicFilePath);
        // eslint-disable-next-line no-console
        console.debug('[KOMPENDIUM] Successfully copied kompendium.json to:', publicFilePath);
    }
    if (isWatcher()) {
        createSymlink(config);
    }
}
async function createOutputDirs(config) {
    let path = config.path;
    if (!(await exists(path))) {
        mkdir(path, { recursive: true });
    }
    path = config.publicPath;
    if (!(await exists(path))) {
        mkdir(path, { recursive: true });
    }
}
async function getReadme() {
    const files = ['readme.md', 'README.md', 'README', 'readme'];
    let data = null;
    for (const file of files) {
        if (data) {
            continue;
        }
        if (!(await exists(file))) {
            continue;
        }
        data = await readFile(file);
    }
    if (!data) {
        logger.warn('README did not exist');
    }
    return data;
}
function generateDocs() {
    return !!process.argv.includes('--docs');
}
function isWatcher() {
    return !!process.argv.includes('--watch');
}
function isProd() {
    const result = !(process.argv.includes('--dev') ||
        process.argv.includes('test') ||
        process.argv.find((arg) => arg.includes('jest-worker')));
    // eslint-disable-next-line no-console
    console.debug('[KOMPENDIUM] isProd() =', result, 'argv:', process.argv.join(' '));
    return result;
}
async function getTypes(config, tsconfig) {
    logger.debug('Getting type information...');
    let types = await readTypes(config);
    const cache = await readCache(config);
    if (types.length === 0 || (await isModified(types, cache))) {
        logger.debug('Parsing types...');
        const data = parseFile(config.typeRoot, tsconfig);
        await saveData(config, data);
        types = data;
    }
    // eslint-disable-next-line no-console
    console.debug('[KOMPENDIUM] getTypes() found', types.length, 'types');
    return types;
}
async function isModified(types, cache) {
    if (Object.keys(cache).length === 0) {
        return true;
    }
    let filenames = types.map((t) => t.sources).flat();
    filenames = [...new Set(filenames)];
    // Handle stat errors gracefully - if a file can't be stat'd, assume it's modified
    const stats = await Promise.all(filenames.map((filename) => stat(filename).catch(() => null)));
    return stats.some((data, index) => {
        const filename = filenames[index];
        // If stat failed, consider the file modified
        if (!data) {
            logger.debug(`${filename} cannot be accessed, marking as modified`);
            return true;
        }
        const result = cache[filename] !== data.mtimeMs;
        logger.debug(`${filename} was ${result ? '' : 'not'} modified!`);
        return result;
    });
}
async function saveData(config, types) {
    let filenames = types.map((t) => t.sources).flat();
    filenames = [...new Set(filenames)];
    // Handle stat errors gracefully - skip files that can't be accessed
    const stats = await Promise.all(filenames.map((filename) => stat(filename).catch(() => null)));
    const cache = {};
    stats.forEach((data, index) => {
        if (data) {
            const filename = filenames[index];
            cache[filename] = data.mtimeMs;
        }
    });
    await Promise.all([writeCache(config, cache), writeTypes(config, types)]);
}
async function readCache(config) {
    try {
        const data = await readFile(`${config.path}/cache.json`);
        return JSON.parse(data);
    }
    catch (_a) {
        return {};
    }
}
async function writeCache(config, data) {
    await writeFile(`${config.path}/cache.json`, JSON.stringify(data));
}
async function readTypes(config) {
    try {
        const data = await readFile(`${config.path}/types.json`);
        return JSON.parse(data);
    }
    catch (_a) {
        return [];
    }
}
async function writeTypes(config, data) {
    await writeFile(`${config.path}/types.json`, JSON.stringify(data));
}
//# sourceMappingURL=generator.js.map
