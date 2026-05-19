import { Application, ReflectionKind, TypeDocReader, TSConfigReader, } from "typedoc";
import { existsSync, readFileSync } from "fs";
import ts from "typescript";
export function parseFile(filename, tsconfig) {
    if (!existsSync(filename)) {
        // eslint-disable-next-line no-console
        console.warn('typeRoot file does not exist', filename);
        return [];
    }
    const app = new Application();
    // Use current working directory as TypeDoc's base path for clean relative paths
    const projectRoot = process.cwd();
    const options = {
        entryPoints: [filename],
        skipErrorChecking: true,
        basePath: projectRoot,
    };
    if (tsconfig) {
        options.tsconfig = tsconfig;
    }
    if (filename.endsWith('.d.ts')) {
        options.exclude = ['**/+(*test*|node_modules)/**'];
    }
    app.options.addReader(new TypeDocReader());
    app.options.addReader(new TSConfigReader());
    app.bootstrap(options);
    const project = app.convert();
    if (!project) {
        // eslint-disable-next-line no-console
        console.warn('Could not find any type information');
        return [];
    }
    const data = [];
    const allInterfaces = project.getReflectionsByKind(ReflectionKind.Interface);
    const allClasses = project.getReflectionsByKind(ReflectionKind.Class);
    const allTypeAliases = project.getReflectionsByKind(ReflectionKind.TypeAlias);
    const allEnums = project.getReflectionsByKind(ReflectionKind.Enum);
    const interfaces = allInterfaces.filter((r) => shouldIncludeType(r));
    const classes = allClasses.filter((r) => shouldIncludeType(r));
    const typeAliases = allTypeAliases.filter((r) => shouldIncludeType(r));
    const enums = allEnums.filter((r) => shouldIncludeType(r));
    interfaces.forEach((reflection) => addInterface(reflection, data));
    classes.forEach((reflection) => addClass(reflection, data));
    typeAliases.forEach((reflection) => addType(reflection, data));
    enums.forEach((reflection) => {
        var _a;
        const members = [];
        const enumReflection = reflection;
        (_a = enumReflection.children) === null || _a === void 0 ? void 0 : _a.forEach((child) => {
            if (child.kind === ReflectionKind.EnumMember) {
                addEnumMember(child, members);
            }
        });
        data.push({
            type: 'enum',
            name: enumReflection.name,
            docs: getDocs(enumReflection),
            docsTags: getDocsTags(enumReflection),
            members: members,
            sources: getSources(enumReflection),
        });
    });
    return data;
}
/**
 * Determines if a type should be included in the documentation based on its source location
 * and documentation tags.
 *
 * Excludes types from:
 * - node_modules (third-party dependencies)
 * - examples directories
 * - test files (.test., .spec., /test/, /tests/)
 * - Types marked with @private or @internal tags
 * - Stencil auto-generated types (components.d.ts, Components namespace, CustomEvent wrappers)
 * @param {DeclarationReflection} reflection - The TypeDoc reflection to check
 * @returns {boolean} true if the type should be documented, false otherwise
 */
function shouldIncludeType(reflection) {
    var _a;
    if (!reflection.sources || reflection.sources.length === 0) {
        // No source information - include by default
        return true;
    }
    for (const source of reflection.sources) {
        const sourcePath = source.fullFileName || source.fileName || '';
        if (shouldExcludeSource(sourcePath)) {
            return false;
        }
    }
    // Exclude CustomEvent wrapper types
    // These are generic wrappers around CustomEvent<T> that don't add useful
    // documentation
    if (reflection.name.endsWith('CustomEvent')) {
        return false;
    }
    // Exclude HTML element interface types
    // These are DOM element interfaces (HTMLLimelButtonElement, etc.) already
    // documented in the Components section
    if (reflection.name.startsWith('HTML') &&
        reflection.name.endsWith('Element')) {
        return false;
    }
    // Exclude types in Stencil's Components namespace
    // Belt-and-suspenders: catches any component interfaces that were not
    // excluded based on source location
    if (isInComponentsNamespace(reflection)) {
        return false;
    }
    // Don't include anything marked @private or @internal
    if ((_a = reflection.comment) === null || _a === void 0 ? void 0 : _a.blockTags) {
        const hasPrivateTag = reflection.comment.blockTags.some((tag) => tag.tag === '@private' || tag.tag === '@internal');
        if (hasPrivateTag) {
            return false;
        }
    }
    // Include this type
    return true;
}
/**
 * Checks if a source path should be excluded from documentation.
 * @param {string} sourcePath - The file path to check
 * @returns {boolean} true if the source should be excluded, false otherwise
 */
function shouldExcludeSource(sourcePath) {
    const normalizedPath = sourcePath.replaceAll('\\', '/');
    if (normalizedPath.includes('node_modules/')) {
        return true;
    }
    if (normalizedPath.includes('/examples/') ||
        normalizedPath.includes('/example/')) {
        return true;
    }
    if (normalizedPath.includes('.test.') ||
        normalizedPath.includes('.spec.')) {
        return true;
    }
    // This file contains component prop interfaces and HTML element types that
    // are already documented in the Components section
    return normalizedPath.endsWith('components.d.ts');
}
/**
 * Checks if a TypeDoc reflection is defined within Stencil's Components namespace.
 *
 * Stencil generates a Components namespace in components.d.ts containing interfaces
 * for component props. These types are already documented in the Components section
 * and should not be duplicated in the Types section.
 * @param {DeclarationReflection} reflection - The TypeDoc reflection to check
 * @returns {boolean} true if the reflection is in a Components namespace, false otherwise
 */
function isInComponentsNamespace(reflection) {
    let current = reflection.parent;
    while (current) {
        if (current.kind === ReflectionKind.Namespace &&
            current.name === 'Components') {
            return true;
        }
        current = current.parent;
    }
    return false;
}
const fns = {
    [ReflectionKind.Interface]: addInterface,
    [ReflectionKind.Class]: addClass,
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
    var _a, _b;
    data.push({
        type: 'interface',
        name: reflection.name,
        typeParams: getTypeParams(reflection),
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        props: ((_a = reflection.children) === null || _a === void 0 ? void 0 : _a.filter(isProperty).map(getProperty)) || [],
        methods: ((_b = reflection.children) === null || _b === void 0 ? void 0 : _b.filter(isMethod).map(getMethod)) || [],
        sources: getSources(reflection),
    });
}
function addClass(reflection, data) {
    var _a, _b;
    const decorators = getDecorators(reflection);
    const implementedInterfaces = getImplementedInterfaces(reflection);
    data.push({
        type: 'class',
        name: reflection.name,
        typeParams: getTypeParams(reflection),
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        props: ((_a = reflection.children) === null || _a === void 0 ? void 0 : _a.filter(isProperty).map((prop) => getPropertyWithInheritDoc(prop, implementedInterfaces))) || [],
        methods: ((_b = reflection.children) === null || _b === void 0 ? void 0 : _b.filter(isMethod).map((method) => getMethodWithInheritDoc(method, implementedInterfaces))) || [],
        sources: getSources(reflection),
        decorators: decorators,
    });
}
function addType(reflection, data) {
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
    let value;
    if (reflection.type && reflection.type.type === 'literal') {
        const literalValue = reflection.type.value;
        if (typeof literalValue === 'string') {
            value = `"${literalValue}"`;
        }
        else {
            value = String(literalValue);
        }
    }
    else {
        value = reflection.defaultValue;
    }
    data.push({
        name: reflection.name,
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        value: value,
    });
}
function getDocs(reflection) {
    var _a;
    if (!reflection.comment) {
        return '';
    }
    const text = ((_a = reflection.comment.summary) === null || _a === void 0 ? void 0 : _a.map((part) => part.text).join('').trim()) || '';
    // Normalize multiple newlines to single newlines
    return text.replaceAll(/\n\n+/g, '\n');
}
function getDocsTags(reflection) {
    var _a, _b;
    return ((_b = (_a = reflection.comment) === null || _a === void 0 ? void 0 : _a.blockTags) === null || _b === void 0 ? void 0 : _b.map(getTag)) || [];
}
function getTag(tag) {
    var _a;
    // tag already has @ prefix, so remove it
    const tagName = tag.tag.replace(/^@+/, '');
    return {
        name: tagName,
        text: ((_a = tag.content) === null || _a === void 0 ? void 0 : _a.map((part) => part.text).join('').trim()) || '',
    };
}
function isProperty(reflection) {
    var _a;
    if (reflection.kind !== ReflectionKind.Property) {
        return false;
    }
    const type = reflection.type;
    return !((type === null || type === void 0 ? void 0 : type.type) === 'reflection' && ((_a = type.declaration) === null || _a === void 0 ? void 0 : _a.signatures));
}
function isMethod(reflection) {
    var _a;
    if (reflection.kind !== ReflectionKind.Property) {
        return false;
    }
    const type = reflection.type;
    return (type === null || type === void 0 ? void 0 : type.type) === 'reflection' && ((_a = type.declaration) === null || _a === void 0 ? void 0 : _a.signatures);
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const type = reflection.type;
    const signature = (_b = (_a = type === null || type === void 0 ? void 0 : type.declaration) === null || _a === void 0 ? void 0 : _a.signatures) === null || _b === void 0 ? void 0 : _b[0];
    if (!signature) {
        return {
            name: reflection.name,
            docs: getDocs(reflection),
            docsTags: [],
            parameters: [],
            returns: { type: 'void', docs: '' },
        };
    }
    let docs = ((_d = (_c = signature.comment) === null || _c === void 0 ? void 0 : _c.summary) === null || _d === void 0 ? void 0 : _d.map((part) => part.text).join('').trim()) || '';
    // Normalize multiple newlines to single newlines
    docs = docs.replaceAll(/\n\n+/g, '\n');
    const parameters = ((_e = signature.parameters) === null || _e === void 0 ? void 0 : _e.map((param) => {
        var _a, _b, _c, _d;
        return ({
            name: param.name,
            type: ((_a = param.type) === null || _a === void 0 ? void 0 : _a.toString()) || 'any',
            docs: ((_c = (_b = param.comment) === null || _b === void 0 ? void 0 : _b.summary) === null || _c === void 0 ? void 0 : _c.map((part) => part.text).join('').trim()) || '',
            default: param.defaultValue,
            optional: ((_d = param.flags) === null || _d === void 0 ? void 0 : _d.isOptional) || false,
        });
    })) || [];
    const returnsTag = (_g = (_f = signature.comment) === null || _f === void 0 ? void 0 : _f.blockTags) === null || _g === void 0 ? void 0 : _g.find((tag) => tag.tag === '@returns');
    const returnsText = ((_h = returnsTag === null || returnsTag === void 0 ? void 0 : returnsTag.content) === null || _h === void 0 ? void 0 : _h.map((part) => part.text).join('').trim()) || '';
    const returns = {
        type: ((_j = signature.type) === null || _j === void 0 ? void 0 : _j.toString()) || 'void',
        docs: returnsText,
    };
    const docsTags = ((_l = (_k = signature.comment) === null || _k === void 0 ? void 0 : _k.blockTags) === null || _l === void 0 ? void 0 : _l.filter((tag) => tag.tag !== '@param' && tag.tag !== '@returns').map(getTag)) || [];
    return {
        name: reflection.name,
        docs: docs,
        docsTags: docsTags,
        parameters: parameters,
        returns: returns,
    };
}
function getImplementedInterfaces(reflection) {
    const interfaces = [];
    const implemented = reflection.implementedTypes;
    if (implemented) {
        implemented.forEach((type) => {
            if (type.reflection) {
                interfaces.push(type.reflection);
            }
        });
    }
    return interfaces;
}
function getPropertyWithInheritDoc(reflection, interfaces) {
    var _a, _b, _c;
    const prop = getProperty(reflection);
    const hasInheritDoc = (_b = (_a = reflection.comment) === null || _a === void 0 ? void 0 : _a.blockTags) === null || _b === void 0 ? void 0 : _b.some((tag) => tag.tag.toLowerCase() === '@inheritdoc');
    if (hasInheritDoc && interfaces.length > 0) {
        // Try to find the property in implemented interfaces
        for (const iface of interfaces) {
            const interfaceProp = (_c = iface.children) === null || _c === void 0 ? void 0 : _c.find((child) => child.name === reflection.name);
            if (interfaceProp) {
                return {
                    ...prop,
                    docs: getDocs(interfaceProp),
                    docsTags: getDocsTags(interfaceProp),
                };
            }
        }
    }
    return prop;
}
function getMethodWithInheritDoc(reflection, interfaces) {
    var _a, _b, _c, _d, _e;
    const type = reflection.type;
    const signature = (_b = (_a = type === null || type === void 0 ? void 0 : type.declaration) === null || _a === void 0 ? void 0 : _a.signatures) === null || _b === void 0 ? void 0 : _b[0];
    const hasInheritDoc = (_d = (_c = signature === null || signature === void 0 ? void 0 : signature.comment) === null || _c === void 0 ? void 0 : _c.blockTags) === null || _d === void 0 ? void 0 : _d.some((tag) => tag.tag.toLowerCase() === '@inheritdoc');
    if (hasInheritDoc && interfaces.length > 0) {
        for (const iface of interfaces) {
            const interfaceMethod = (_e = iface.children) === null || _e === void 0 ? void 0 : _e.find((child) => child.name === reflection.name);
            if (interfaceMethod) {
                return getMethod(interfaceMethod);
            }
        }
    }
    return getMethod(reflection);
}
/**
 * Extract decorator information from TypeScript source code using AST parsing
 *
 * TypeDoc 0.23 removed the decorators property from DeclarationReflection,
 * which was present in 0.17. This function works around that limitation by
 * parsing the original TypeScript source files to extract decorator information.
 * @param {DeclarationReflection} reflection - The TypeDoc reflection to extract decorators from
 * @returns {DecoratorDescription[]} Array of decorator descriptions with names and arguments
 * @remarks
 * This is a workaround for incomplete TypeDoc 0.23 API. TypeDoc removed
 * decorator information from their reflection model, but decorators are
 * essential for documenting Stencil components (e.g., @Component, @Prop).
 *
 * Performance considerations:
 * - Reads and parses source files on demand (I/O + parsing overhead)
 * - Caches nothing - each call re-parses the file
 * - For large codebases, consider caching parsed source files
 *
 * Known limitations:
 * - Only extracts class-level decorators, not property/method decorators
 * - Decorator arguments are captured as raw text, not parsed
 * - Fails silently if source file is unavailable or parsing fails
 * - Depends on TypeScript AST structure (may break with TS version changes)
 * @example
 * ```typescript
 * // For a class like:
 * @Component({ tag: 'my-component' })
 * class MyComponent { }
 *
 * // Returns:
 * [{
 *   name: 'Component',
 *   arguments: { _config: "{ tag: 'my-component' }" }
 * }]
 * ```
 */
function getDecorators(reflection) {
    if (!reflection.sources || reflection.sources.length === 0) {
        return [];
    }
    const source = reflection.sources[0];
    const fileName = source.fullFileName || source.fileName;
    if (!existsSync(fileName)) {
        return [];
    }
    try {
        const sourceFile = ts.createSourceFile(fileName, readFileSync(fileName, 'utf8'), ts.ScriptTarget.Latest, true);
        let decorators = [];
        const visit = (node) => {
            var _a;
            if (ts.isClassDeclaration(node) &&
                ((_a = node.name) === null || _a === void 0 ? void 0 : _a.getText()) === reflection.name) {
                let nodeDecorators;
                if (ts.canHaveDecorators(node)) {
                    nodeDecorators = ts.getDecorators(node);
                }
                if (nodeDecorators) {
                    decorators = nodeDecorators.map((decorator) => {
                        const expression = decorator.expression;
                        let name = '';
                        let args = {};
                        if (ts.isCallExpression(expression)) {
                            name = expression.expression.getText();
                            if (expression.arguments.length > 0) {
                                args = {
                                    _config: expression.arguments[0].getText(),
                                };
                            }
                        }
                        else {
                            name = expression.getText();
                        }
                        return { name: name, arguments: args };
                    });
                }
            }
            ts.forEachChild(node, visit);
        };
        visit(sourceFile);
        return decorators;
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Failed to parse decorators:', error);
        return [];
    }
}
function getTypeParams(reflection) {
    var _a;
    return (((_a = reflection.typeParameters) === null || _a === void 0 ? void 0 : _a.map((param) => ({
        name: param.name,
    }))) || []);
}
function getSources(reflection) {
    var _a;
    return ((_a = reflection.sources) === null || _a === void 0 ? void 0 : _a.map((source) => source.fileName)) || [];
}
//# sourceMappingURL=typedoc.js.map
