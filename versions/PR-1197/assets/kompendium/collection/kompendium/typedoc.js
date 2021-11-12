import { Application, ReflectionKind, } from 'typedoc';
import negate from 'lodash/negate';
import { existsSync } from 'fs';
export function parseFile(filename) {
    if (!existsSync(filename)) {
        console.warn('typeRoot file does not exist', filename);
        return [];
    }
    const app = new Application();
    const options = {
        readme: 'none',
    };
    if (filename.endsWith('.d.ts')) {
        options.includeDeclarations = true;
        options.exclude = ['**/+(*test*|node_modules)/**'];
    }
    app.bootstrap(options);
    const reflection = app.convert([filename]);
    if (!reflection) {
        console.warn('Could not find any type information');
        return [];
    }
    const data = [];
    reflection.traverse(traverseCallback(data));
    return data;
}
const fns = {
    [ReflectionKind.Interface]: addInterface,
    [ReflectionKind.CallSignature]: addSignature,
    [ReflectionKind.Parameter]: addParam,
    [ReflectionKind.TypeAlias]: addType,
    [ReflectionKind.Enum]: addEnum,
    [ReflectionKind.EnumMember]: addEnumMember,
};
const traverseCallback = (data) => (reflection) => {
    const fn = fns[reflection.kind];
    if (fn) {
        fn(reflection, data);
    }
    else {
        reflection.traverse(traverseCallback(data));
    }
};
function addInterface(reflection, data) {
    if (!reflection.flags.isExported) {
        return;
    }
    data.push({
        type: 'interface',
        name: reflection.name,
        typeParams: getTypeParams(reflection),
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        props: reflection.children.filter(isProperty).map(getProperty),
        methods: reflection.children.filter(isMethod).map(getMethod),
        sources: getSources(reflection),
    });
}
function addSignature(reflection, data) {
    var _a, _b;
    data.parameters = [];
    data.returns = {
        type: reflection.type.toString(),
        docs: ((_b = (_a = reflection.parent.parent.comment) === null || _a === void 0 ? void 0 : _a.tags) === null || _b === void 0 ? void 0 : _b.find(isReturns).text) || '',
    };
    reflection.traverse(traverseCallback(data));
}
function addParam(reflection, data) {
    var _a, _b, _c;
    data.parameters.push({
        name: reflection.name,
        type: reflection.type.toString(),
        docs: ((_c = (_b = (_a = reflection.parent.parent.parent.comment) === null || _a === void 0 ? void 0 : _a.tags) === null || _b === void 0 ? void 0 : _b.filter(isParam).find((tag) => tag.paramName === reflection.name)) === null || _c === void 0 ? void 0 : _c.text.trim()) || '',
        default: reflection.defaultValue,
        optional: reflection.flags.isOptional,
    });
}
function addType(reflection, data) {
    if (!reflection.flags.isExported) {
        return;
    }
    data.push({
        type: 'alias',
        name: reflection.name,
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        alias: reflection.type.toString(),
        sources: getSources(reflection),
    });
}
function addEnum(reflection, data) {
    if (!reflection.flags.isExported) {
        return;
    }
    const members = [];
    reflection.traverse(traverseCallback(members));
    data.push({
        type: 'enum',
        name: reflection.name,
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        members: members,
        sources: getSources(reflection),
    });
}
function addEnumMember(reflection, data) {
    data.push({
        name: reflection.name,
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        value: reflection.defaultValue,
    });
}
function getDocs(reflection) {
    var _a, _b;
    return [(_a = reflection.comment) === null || _a === void 0 ? void 0 : _a.shortText, (_b = reflection.comment) === null || _b === void 0 ? void 0 : _b.text]
        .join('\n')
        .trim();
}
function getDocsTags(reflection) {
    var _a, _b;
    return ((_b = (_a = reflection.comment) === null || _a === void 0 ? void 0 : _a.tags) === null || _b === void 0 ? void 0 : _b.map(getTag)) || [];
}
function getTag(tag) {
    return {
        name: tag.tagName,
        text: tag.text.trim(),
    };
}
function isProperty(reflection) {
    return (reflection.kind === ReflectionKind.Property &&
        reflection.type.toString() !== 'function');
}
function isMethod(reflection) {
    return (reflection.kind === ReflectionKind.Property &&
        reflection.type.toString() === 'function');
}
function isParam(tag) {
    return tag.tagName === 'param';
}
function isReturns(tag) {
    return tag.tagName === 'returns';
}
function getProperty(reflection) {
    return {
        name: reflection.name,
        type: reflection.type.toString(),
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        default: reflection.defaultValue,
        optional: reflection.flags.isOptional,
    };
}
function getMethod(reflection) {
    var _a;
    const signature = getSignature(reflection);
    return Object.assign({ name: reflection.name, docs: getDocs(reflection), docsTags: (_a = reflection.comment.tags) === null || _a === void 0 ? void 0 : _a.filter(negate(isParam)).filter(negate(isReturns)).map(getTag) }, signature);
}
function getSignature(reflection) {
    const signature = {};
    reflection.traverse(traverseCallback(signature));
    return signature;
}
function getTypeParams(reflection) {
    var _a;
    return (((_a = reflection.typeParameters) === null || _a === void 0 ? void 0 : _a.map((param) => ({
        name: param.name,
    }))) || []);
}
function getSources(reflection) {
    return reflection.sources.map((source) => source.file.fullFileName);
}
