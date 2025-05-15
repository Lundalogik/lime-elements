import {
    JsonDocs,
    JsonDocsComponent,
    JsonDocsTag,
} from '@stencil/core/internal';
import { readFile } from './filesystem';
import { extname, join } from 'path';

export interface JsonDocsSource {
    filename: string;
    type: 'tsx' | 'ts' | 'scss' | 'less' | 'css';
    source: string;
}

export async function addSources(docs: JsonDocs): Promise<JsonDocs> {
    const components = await Promise.all(
        docs.components?.map(addComponentSources) || []
    );

    return {
        ...docs,
        components,
    };
}

export async function addComponentSources(
    component: JsonDocsComponent
): Promise<any> {
    const sources = await getSources(component);

    return {
        ...component,
        sources: sources,
    };
}

export async function getSources(
    component: JsonDocsComponent
): Promise<JsonDocsSource[]> {
    const source = await readFile(component.filePath);
    const styleNames = getStyleFiles(source);
    const styles = await Promise.all(
        styleNames.map(getStyle(component.dirPath))
    );
    const links = await getLinks(component);

    return [
        {
            filename: component.fileName,
            type: 'tsx',
            source,
        },
        ...styles,
        ...links,
    ];
}

export function getStyleFiles(source: string): string[] {
    const result = [];
    let regex = /@Component\((\{.+?\})\)/s;
    let match = regex.exec(source);
    const config = match && match[1];

    if (!config) {
        return result;
    }

    regex = /styleUrl:.+?['"](.+?)['"]/s;
    match = regex.exec(config);

    if (match && match[1]) {
        result.push(match[1]);
    }

    return result;
}

const getStyle = (path: string) => async (
    name: string
): Promise<JsonDocsSource> => {
    const source = await readFile([path, name].join('/'));
    return {
        filename: name,
        type: 'scss',
        source: source,
    };
};

async function getLinks(
    component: JsonDocsComponent
): Promise<JsonDocsSource[]> {
    const linkTags = component.docsTags.filter((tag) => tag.name === 'link');

    return Promise.all<JsonDocsSource>(linkTags.map(getLink(component)));
}

const getLink = (component: JsonDocsComponent) => async (
    tag: JsonDocsTag
): Promise<JsonDocsSource> => {
    let source: string;
    try {
        source = await readFile(join(component.dirPath, tag.text));
    } catch {
        source = `File ${tag.text} not found`;
    }

    return {
        filename: tag.text,
        type: extname(tag.text).replace('.', '') as any,
        source: source,
    };
};
