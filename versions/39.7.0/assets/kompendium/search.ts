import {
    AliasDescription,
    EnumDescription,
    InterfaceDescription,
    KompendiumData,
    KompendiumDocument,
    MenuItem,
} from '../types';
import Fuse from 'fuse.js';
import {
    JsonDocs,
    JsonDocsComponent,
    JsonDocsEvent,
    JsonDocsProp,
    JsonDocsTag,
} from '@stencil/core/internal';

export function createIndex(data: KompendiumData): any {
    const docs = createDocs(data);
    const keys: Fuse.FuseOptionKey[] = [
        'tags',
        'title',
        'path',
        'text',
        'props.name',
        'props.text',
        'props.tags',
        'props.type',
        'events.name',
        'events.text',
        'events.tags',
        'events.type',
    ];

    const index = Fuse.createIndex(keys, docs);

    return {
        documents: docs,
        data: index.toJSON(),
    };
}

function createDocs(data: KompendiumData): KompendiumDocument[] {
    return Array.from(createDocuments(data.menu, data));
}

export function* createDocuments(
    items: MenuItem[],
    data: KompendiumData,
): Generator<KompendiumDocument> {
    for (const item of items) {
        if (isIndexable(item)) {
            const document = createDocument(item, data);
            if (document) {
                yield document;
            }
        }

        if (item.children?.length) {
            yield* createDocuments(item.children, data);
        }
    }
}

function isIndexable(item: MenuItem): boolean {
    if (item.path?.match(/^\/component\/[\w-]+\/$/)) {
        return true;
    }

    return !!item.children?.length;
}

function createDocument(
    item: MenuItem,
    data: KompendiumData,
): KompendiumDocument {
    if (item.path?.startsWith('/component/')) {
        return createComponentDocument(item, data);
    } else if (item.path?.startsWith('/type/')) {
        return createTypeDocument(item, data);
    }

    return createGuideDocument(item, data);
}

function createComponentDocument(
    item: MenuItem,
    data: KompendiumData,
): KompendiumDocument {
    const tag = item.path.split('/')[2];
    const component = data.docs.components.find((c) => c.tag === tag);
    if (!component) {
        return;
    }

    const examples = findExamples(component, data.docs);

    return {
        path: item.path,
        title: item.title,
        text: [component.docs, ...examples.map((e) => e.docs)],
        props: component.props.map(createPropDocument),
        events: component.events.map(createPropDocument),
        tags: component.docsTags.map(createTagDocument),
    };
}

function createTypeDocument(
    item: MenuItem,
    data: KompendiumData,
): KompendiumDocument {
    const type = data.types?.find((t) => t.name === item.title);

    if (type?.type === 'interface') {
        return createInterfaceDocument(item, type as InterfaceDescription);
    } else if (type?.type === 'alias') {
        return createAliasDocument(item, type as AliasDescription);
    } else if (type?.type === 'enum') {
        return createEnumDocument(item, type as EnumDescription);
    }
}

function createGuideDocument(
    item: MenuItem,
    data: KompendiumData,
): KompendiumDocument {
    const guide = data.guides?.find((g) => g.data.path === item.path);

    return {
        path: item.path,
        title: item.title,
        text: guide?.content,
    };
}

function createInterfaceDocument(
    item: MenuItem,
    type: InterfaceDescription,
): KompendiumDocument {
    return {
        path: item.path,
        title: item.title,
        text: type.docs,
        props: type.props.map(createPropDocument),
        tags: type.docsTags?.map(createTagDocument),
    };
}

function createAliasDocument(
    item: MenuItem,
    type: AliasDescription,
): KompendiumDocument {
    return {
        path: item.path,
        title: item.title,
        text: type.docs,
    };
}

// eslint-disable-next-line sonarjs/no-identical-functions
function createEnumDocument(
    item: MenuItem,
    type: EnumDescription,
): KompendiumDocument {
    return {
        path: item.path,
        title: item.title,
        text: type.docs,
    };
}

function findExamples(component: JsonDocsComponent, docs: JsonDocs) {
    return component.docsTags
        .filter(isTag('exampleComponent'))
        .map(findComponentByTag(docs));
}

const findComponentByTag = (docs: JsonDocs) => (tag: JsonDocsTag) => {
    return docs.components.find((component) => component.tag === tag.text);
};

const isTag = (name: string) => (tag: JsonDocsTag) => {
    return tag.name === name;
};

function createPropDocument(prop: JsonDocsProp | JsonDocsEvent) {
    return {
        name: (prop as JsonDocsProp).name || (prop as JsonDocsEvent).event,
        tags: prop.docsTags?.map(createTagDocument),
        text: prop.docs,
        type: (prop as JsonDocsProp)?.type || (prop as JsonDocsEvent).detail,
    };
}

function createTagDocument(tag: JsonDocsTag) {
    return [tag.name, tag.text].join(' ');
}
