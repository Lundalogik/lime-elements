import Fuse from "fuse.js";
export function createIndex(data) {
    const docs = createDocs(data);
    const keys = [
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
function createDocs(data) {
    return Array.from(createDocuments(data.menu, data));
}
export function* createDocuments(items, data) {
    var _a;
    for (const item of items) {
        if (isIndexable(item)) {
            const document = createDocument(item, data);
            if (document) {
                yield document;
            }
        }
        if ((_a = item.children) === null || _a === void 0 ? void 0 : _a.length) {
            yield* createDocuments(item.children, data);
        }
    }
}
function isIndexable(item) {
    var _a, _b;
    if ((_a = item.path) === null || _a === void 0 ? void 0 : _a.match(/^\/component\/[\w-]+\/$/)) {
        return true;
    }
    return !!((_b = item.children) === null || _b === void 0 ? void 0 : _b.length);
}
function createDocument(item, data) {
    var _a, _b;
    if ((_a = item.path) === null || _a === void 0 ? void 0 : _a.startsWith('/component/')) {
        return createComponentDocument(item, data);
    }
    else if ((_b = item.path) === null || _b === void 0 ? void 0 : _b.startsWith('/type/')) {
        return createTypeDocument(item, data);
    }
    return createGuideDocument(item, data);
}
function createComponentDocument(item, data) {
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
function createTypeDocument(item, data) {
    var _a;
    const type = (_a = data.types) === null || _a === void 0 ? void 0 : _a.find((t) => t.name === item.title);
    if ((type === null || type === void 0 ? void 0 : type.type) === 'interface') {
        return createInterfaceDocument(item, type);
    }
    else if ((type === null || type === void 0 ? void 0 : type.type) === 'alias') {
        return createAliasDocument(item, type);
    }
    else if ((type === null || type === void 0 ? void 0 : type.type) === 'enum') {
        return createEnumDocument(item, type);
    }
}
function createGuideDocument(item, data) {
    var _a;
    const guide = (_a = data.guides) === null || _a === void 0 ? void 0 : _a.find((g) => g.data.path === item.path);
    return {
        path: item.path,
        title: item.title,
        text: guide === null || guide === void 0 ? void 0 : guide.content,
    };
}
function createInterfaceDocument(item, type) {
    var _a;
    return {
        path: item.path,
        title: item.title,
        text: type.docs,
        props: type.props.map(createPropDocument),
        tags: (_a = type.docsTags) === null || _a === void 0 ? void 0 : _a.map(createTagDocument),
    };
}
function createAliasDocument(item, type) {
    return {
        path: item.path,
        title: item.title,
        text: type.docs,
    };
}
// eslint-disable-next-line sonarjs/no-identical-functions
function createEnumDocument(item, type) {
    return {
        path: item.path,
        title: item.title,
        text: type.docs,
    };
}
function findExamples(component, docs) {
    return component.docsTags
        .filter(isTag('exampleComponent'))
        .map(findComponentByTag(docs));
}
const findComponentByTag = (docs) => (tag) => {
    return docs.components.find((component) => component.tag === tag.text);
};
const isTag = (name) => (tag) => {
    return tag.name === name;
};
function createPropDocument(prop) {
    var _a;
    return {
        name: prop.name || prop.event,
        tags: (_a = prop.docsTags) === null || _a === void 0 ? void 0 : _a.map(createTagDocument),
        text: prop.docs,
        type: (prop === null || prop === void 0 ? void 0 : prop.type) || prop.detail,
    };
}
function createTagDocument(tag) {
    return [tag.name, tag.text].join(' ');
}
//# sourceMappingURL=search.js.map
