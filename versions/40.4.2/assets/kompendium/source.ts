import {
    JsonDocs,
    JsonDocsComponent,
    JsonDocsTag,
} from '@stencil/core/internal';
import { readFile } from 'fs/promises';
import { extname, join } from 'path';

export interface JsonDocsSource {
    filename: string;
    type: 'tsx' | 'ts' | 'scss' | 'less' | 'css';
    source: string;
}

export async function addSources(docs: JsonDocs): Promise<JsonDocs> {
    const components = await Promise.all(
        docs.components?.map(addComponentSources) || [],
    );

    return {
        ...docs,
        components: components,
    };
}

export async function addComponentSources(
    component: JsonDocsComponent,
): Promise<any> {
    const sources = await getSources(component);

    return {
        ...component,
        sources: sources,
    };
}

export async function getSources(
    component: JsonDocsComponent,
): Promise<JsonDocsSource[]> {
    const source = await readFile(component.filePath, 'utf8');
    const styleNames = getStyleFiles(source);
    const styles = await Promise.all(
        styleNames.map(getStyle(component.dirPath)),
    );
    const links = await getLinkedSourceFiles(component);

    return [
        {
            filename: component.fileName,
            type: 'tsx',
            source: source,
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

const getStyle =
    (path: string) =>
    async (name: string): Promise<JsonDocsSource> => {
        const source = await readFile([path, name].join('/'), 'utf8');

        return {
            filename: name,
            type: 'scss',
            source: source,
        };
    };

async function getLinkedSourceFiles(
    component: JsonDocsComponent,
): Promise<JsonDocsSource[]> {
    const deprecatedLinkTags = component.docsTags.filter(
        (tag) => tag.name === 'link',
    );
    if (deprecatedLinkTags.length > 0) {
        // eslint-disable-next-line no-console
        console.warn(
            'Using the @link tag to link source files for display alongside examples is deprecated. ' +
                'Use @sourceFile instead.',
        );
    }

    const linkTags = component.docsTags.filter(
        (tag) => tag.name === 'sourceFile',
    );
    const backwardsCompatibleLinkTags = [...linkTags, ...deprecatedLinkTags];

    return Promise.all<JsonDocsSource>(
        backwardsCompatibleLinkTags.map(getLink(component)),
    );
}

const getLink =
    (component: JsonDocsComponent) =>
    async (tag: JsonDocsTag): Promise<JsonDocsSource> => {
        let source: string;
        try {
            source = await readFile(join(component.dirPath, tag.text), 'utf8');
        } catch {
            source = `File ${tag.text} not found`;
        }

        return {
            filename: tag.text,
            type: extname(tag.text).replace('.', '') as any,
            source: source,
        };
    };
