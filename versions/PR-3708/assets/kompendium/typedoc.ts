import {
    Application,
    Reflection,
    ReflectionKind,
    DeclarationReflection,
    TypeDocOptions,
    CommentTag,
    TypeDocReader,
    TSConfigReader,
} from 'typedoc';
import { JsonDocsTag, JsonDocsProp } from '@stencil/core/internal';
import {
    InterfaceDescription,
    AliasDescription,
    EnumDescription,
    EnumMember,
    TypeDescription,
    MethodDescription,
    ParameterDescription,
    ClassDescription,
    DecoratorDescription,
} from '../types';
import { existsSync, readFileSync } from 'fs';
import * as ts from 'typescript';

export function parseFile(
    filename: string,
    tsconfig?: string,
): TypeDescription[] {
    if (!existsSync(filename)) {
        // eslint-disable-next-line no-console
        console.warn('typeRoot file does not exist', filename);

        return [];
    }

    // TypeDoc 0.23 still uses the synchronous API with new Application()
    const app = new Application();

    // Use current working directory as TypeDoc's base path for clean relative paths
    const projectRoot = process.cwd();

    const options: Partial<TypeDocOptions> = {
        entryPoints: [filename],
        skipErrorChecking: true,
        basePath: projectRoot,
    };

    if (tsconfig) {
        options.tsconfig = tsconfig;
    }

    if (filename.endsWith('.d.ts')) {
        // TypeDoc 0.23+ handles .d.ts files automatically
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

    const data: TypeDescription[] = [];

    // TypeDoc 0.23.28 traverse() only visits top-level exports from entry points.
    // For files with re-exports (like dist/types/index.d.ts that re-exports from
    // ./components and ./interface), nested types won't be visited.
    // Use getReflectionsByKind() to get ALL types regardless of module nesting.
    const allInterfaces = project.getReflectionsByKind(
        ReflectionKind.Interface,
    );
    const allClasses = project.getReflectionsByKind(ReflectionKind.Class);
    const allTypeAliases = project.getReflectionsByKind(
        ReflectionKind.TypeAlias,
    );
    const allEnums = project.getReflectionsByKind(ReflectionKind.Enum);

    // Filter out types from node_modules, examples, tests, and private/internal types
    const interfaces = allInterfaces.filter((r) =>
        shouldIncludeType(r as DeclarationReflection),
    );
    const classes = allClasses.filter((r) =>
        shouldIncludeType(r as DeclarationReflection),
    );
    const typeAliases = allTypeAliases.filter((r) =>
        shouldIncludeType(r as DeclarationReflection),
    );
    const enums = allEnums.filter((r) =>
        shouldIncludeType(r as DeclarationReflection),
    );

    interfaces.forEach((reflection) =>
        addInterface(reflection as DeclarationReflection, data as any),
    );
    classes.forEach((reflection) =>
        addClass(reflection as DeclarationReflection, data as any),
    );
    typeAliases.forEach((reflection) =>
        addType(reflection as DeclarationReflection, data as any),
    );
    enums.forEach((reflection) => {
        const members: EnumMember[] = [];
        const enumReflection = reflection as DeclarationReflection;
        enumReflection.children?.forEach((child) => {
            if (child.kind === ReflectionKind.EnumMember) {
                addEnumMember(child as DeclarationReflection, members);
            }
        });
        data.push({
            type: 'enum',
            name: enumReflection.name,
            docs: getDocs(enumReflection),
            docsTags: getDocsTags(enumReflection),
            members: members,
            sources: getSources(enumReflection),
        } as EnumDescription);
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
function shouldIncludeType(reflection: DeclarationReflection): boolean {
    // Check if type has sources
    if (!reflection.sources || reflection.sources.length === 0) {
        // No source information - include by default
        return true;
    }

    // Check all source locations
    for (const source of reflection.sources) {
        const sourcePath = source.fullFileName || source.fileName || '';

        if (shouldExcludeSource(sourcePath)) {
            return false;
        }
    }

    // LAYER 2: Exclude CustomEvent wrapper types
    // These are generic wrappers around CustomEvent<T> that don't add useful documentation
    if (reflection.name.endsWith('CustomEvent')) {
        return false;
    }

    // LAYER 2: Exclude HTML element interface types
    // These are DOM element interfaces (HTMLLimelButtonElement, etc.) already in Components
    if (
        reflection.name.startsWith('HTML') &&
        reflection.name.endsWith('Element')
    ) {
        return false;
    }

    // LAYER 3: Exclude types in Stencil's Components namespace
    // Belt-and-suspenders: catches any component interfaces that leaked through Layer 1
    if (isInComponentsNamespace(reflection)) {
        return false;
    }

    // Check for @private or @internal tags
    if (reflection.comment?.blockTags) {
        const hasPrivateTag = reflection.comment.blockTags.some(
            (tag: any) => tag.tag === '@private' || tag.tag === '@internal',
        );
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
function shouldExcludeSource(sourcePath: string): boolean {
    // Normalize path separators for cross-platform compatibility
    const normalizedPath = sourcePath.replace(/\\/g, '/');

    // Exclude types from node_modules
    if (normalizedPath.includes('node_modules/')) {
        return true;
    }

    // Exclude types from examples directories
    if (
        normalizedPath.includes('/examples/') ||
        normalizedPath.includes('/example/')
    ) {
        return true;
    }

    // Exclude types from test files (but not fixture files used by tests)
    if (
        normalizedPath.includes('.test.') ||
        normalizedPath.includes('.spec.')
    ) {
        return true;
    }

    // LAYER 1: Exclude types from Stencil's auto-generated components.d.ts
    // This file contains component prop interfaces and HTML element types that are
    // already documented in the Components section
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
function isInComponentsNamespace(reflection: DeclarationReflection): boolean {
    let current: Reflection | undefined = reflection.parent;
    while (current) {
        if (
            current.kind === ReflectionKind.Namespace &&
            current.name === 'Components'
        ) {
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

const traverseCallback = (data: any) => (reflection: Reflection) => {
    const fn = fns[reflection.kind];
    if (fn) {
        fn(reflection, data);
    } else {
        reflection.traverse(traverseCallback(data));
    }
};

function addInterface(
    reflection: DeclarationReflection,
    data: InterfaceDescription[],
) {
    // TypeDoc 0.23+ handles exports differently, removed isExported check

    data.push({
        type: 'interface',
        name: reflection.name,
        typeParams: getTypeParams(reflection),
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        props: reflection.children?.filter(isProperty).map(getProperty) || [],
        methods: reflection.children?.filter(isMethod).map(getMethod) || [],
        sources: getSources(reflection),
    });
}

function addClass(reflection: DeclarationReflection, data: ClassDescription[]) {
    // TypeDoc 0.23+ handles exports differently, removed isExported check

    // Get decorators from AST if available, otherwise return empty array
    const decorators = getDecorators(reflection);

    // Get implemented interfaces for @inheritDoc resolution
    const implementedInterfaces = getImplementedInterfaces(reflection);

    data.push({
        type: 'class',
        name: reflection.name,
        typeParams: getTypeParams(reflection),
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        props:
            reflection.children
                ?.filter(isProperty)
                .map((prop) =>
                    getPropertyWithInheritDoc(prop, implementedInterfaces),
                ) || [],
        methods:
            reflection.children
                ?.filter(isMethod)
                .map((method) =>
                    getMethodWithInheritDoc(method, implementedInterfaces),
                ) || [],
        sources: getSources(reflection),
        decorators: decorators,
    });
}

function addType(reflection: DeclarationReflection, data: AliasDescription[]) {
    // TypeDoc 0.23+ handles exports differently, removed isExported check

    data.push({
        type: 'alias',
        name: reflection.name,
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        alias: reflection.type.toString(),
        sources: getSources(reflection),
    });
}

function addEnum(reflection: DeclarationReflection, data: EnumDescription[]) {
    // TypeDoc 0.23+ handles exports differently, removed isExported check

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

function addEnumMember(reflection: DeclarationReflection, data: EnumMember[]) {
    // TypeDoc 0.23+ stores enum values in type.value instead of defaultValue
    let value: string;
    // TypeDoc 0.23 types don't include 'type' and 'value' properties on reflection types
    // These properties exist at runtime for literal types but aren't in TypeScript definitions
    if (reflection.type && (reflection.type as any).type === 'literal') {
        const literalValue = (reflection.type as any).value;
        if (typeof literalValue === 'string') {
            value = `"${literalValue}"`;
        } else {
            value = String(literalValue);
        }
    } else {
        value = reflection.defaultValue;
    }

    data.push({
        name: reflection.name,
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        value: value,
    });
}

function getDocs(reflection: Reflection): string {
    if (!reflection.comment) {
        return '';
    }

    // TypeDoc 0.23+ uses summary instead of shortText/text
    const text =
        reflection.comment.summary
            ?.map((part: any) => part.text)
            .join('')
            .trim() || '';

    // Normalize multiple newlines to single newlines
    return text.replace(/\n\n+/g, '\n');
}

function getDocsTags(reflection: DeclarationReflection) {
    // TypeDoc 0.23+ uses blockTags instead of tags
    return reflection.comment?.blockTags?.map(getTag) || [];
}

function getTag(tag: CommentTag): JsonDocsTag {
    // TypeDoc 0.23+ uses tag and content instead of tagName and text
    // tag already has @ prefix in TypeDoc 0.23, so remove it
    const tagName = (tag.tag as string).replace(/^@+/, '');

    return {
        name: tagName,
        text:
            tag.content
                ?.map((part: any) => part.text)
                .join('')
                .trim() || '',
    };
}

function isProperty(reflection: DeclarationReflection): boolean {
    // TypeDoc 0.23+ uses ReflectionType with signatures for functions
    if (reflection.kind !== ReflectionKind.Property) {
        return false;
    }

    // TypeDoc types don't expose 'type' and 'declaration' properties on reflection.type
    // These exist at runtime but require type assertion to access
    const type = reflection.type as any;

    return !(
        type &&
        type.type === 'reflection' &&
        type.declaration?.signatures
    );
}

function isMethod(reflection: DeclarationReflection): boolean {
    // TypeDoc 0.23+ uses ReflectionType with signatures for functions
    if (reflection.kind !== ReflectionKind.Property) {
        return false;
    }

    // TypeDoc types don't expose 'type' and 'declaration' properties on reflection.type
    // These exist at runtime but require type assertion to access
    const type = reflection.type as any;

    return type && type.type === 'reflection' && type.declaration?.signatures;
}

function getProperty(reflection: DeclarationReflection): Partial<JsonDocsProp> {
    return {
        name: reflection.name,
        type: reflection.type.toString(),
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        default: reflection.defaultValue,
        optional: reflection.flags.isOptional,
    };
}

function getMethod(reflection: DeclarationReflection): MethodDescription {
    // TypeDoc 0.23+ stores method signatures in type.declaration.signatures
    // TypeDoc types don't expose declaration property, but it exists at runtime
    const type = reflection.type as any;
    const signature = type?.declaration?.signatures?.[0];

    if (!signature) {
        return {
            name: reflection.name,
            docs: getDocs(reflection),
            docsTags: [],
            parameters: [],
            returns: { type: 'void', docs: '' },
        };
    }

    // Get docs from signature, not from the property
    let docs =
        signature.comment?.summary
            ?.map((part: any) => part.text)
            .join('')
            .trim() || '';
    // Normalize multiple newlines to single newlines
    docs = docs.replace(/\n\n+/g, '\n');

    // Get parameters
    const parameters: ParameterDescription[] =
        signature.parameters?.map((param: any) => ({
            name: param.name,
            type: param.type?.toString() || 'any',
            docs:
                param.comment?.summary
                    ?.map((part: any) => part.text)
                    .join('')
                    .trim() || '',
            default: param.defaultValue,
            optional: param.flags?.isOptional || false,
        })) || [];

    // Get return type
    const returnsTag = signature.comment?.blockTags?.find(
        (tag: any) => tag.tag === '@returns',
    );
    const returnsText =
        returnsTag?.content
            ?.map((part: any) => part.text)
            .join('')
            .trim() || '';

    const returns = {
        type: signature.type?.toString() || 'void',
        docs: returnsText,
    };

    // Get other tags (excluding @param and @returns)
    const docsTags =
        signature.comment?.blockTags
            ?.filter(
                (tag: any) => tag.tag !== '@param' && tag.tag !== '@returns',
            )
            .map(getTag) || [];

    return {
        name: reflection.name,
        docs: docs,
        docsTags: docsTags,
        parameters: parameters,
        returns: returns,
    };
}

function getImplementedInterfaces(
    reflection: DeclarationReflection,
): DeclarationReflection[] {
    const interfaces: DeclarationReflection[] = [];

    // Check if class implements any interfaces
    // implementedTypes exists on DeclarationReflection at runtime but not in type definitions
    const implemented = (reflection as any).implementedTypes;
    if (implemented) {
        implemented.forEach((type: any) => {
            if (type.reflection) {
                interfaces.push(type.reflection);
            }
        });
    }

    return interfaces;
}

function getPropertyWithInheritDoc(
    reflection: DeclarationReflection,
    interfaces: DeclarationReflection[],
): Partial<JsonDocsProp> {
    const prop = getProperty(reflection);

    // Check for @inheritDoc tag in blockTags
    const hasInheritDoc = reflection.comment?.blockTags?.some(
        (tag: any) => tag.tag.toLowerCase() === '@inheritdoc',
    );

    if (hasInheritDoc && interfaces.length > 0) {
        // Try to find the property in implemented interfaces
        for (const iface of interfaces) {
            const interfaceProp = iface.children?.find(
                (child) => child.name === reflection.name,
            );
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

function getMethodWithInheritDoc(
    reflection: DeclarationReflection,
    interfaces: DeclarationReflection[],
): MethodDescription {
    // Check for @inheritDoc in the method signature blockTags
    // TypeDoc types don't expose declaration property, but it exists at runtime
    const type = reflection.type as any;
    const signature = type?.declaration?.signatures?.[0];
    const hasInheritDoc = signature?.comment?.blockTags?.some(
        (tag: any) => tag.tag.toLowerCase() === '@inheritdoc',
    );

    if (hasInheritDoc && interfaces.length > 0) {
        // Try to find the method in implemented interfaces and return its parsed version
        for (const iface of interfaces) {
            const interfaceMethod = iface.children?.find(
                (child) => child.name === reflection.name,
            );
            if (interfaceMethod) {
                return getMethod(interfaceMethod);
            }
        }
    }

    // If no inheritDoc or interface not found, return the method as-is
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
function getDecorators(
    reflection: DeclarationReflection,
): DecoratorDescription[] {
    // TypeDoc 0.23+ removed the decorators property
    // We need to parse decorators from the TypeScript AST
    if (!reflection.sources || reflection.sources.length === 0) {
        return [];
    }

    const source = reflection.sources[0];
    const fileName = source.fullFileName || source.fileName;

    if (!existsSync(fileName)) {
        return [];
    }

    try {
        const sourceFile = ts.createSourceFile(
            fileName,
            readFileSync(fileName, 'utf8'),
            ts.ScriptTarget.Latest,
            true,
        );

        let decorators: DecoratorDescription[] = [];

        const visit = (node: ts.Node): void => {
            if (
                ts.isClassDeclaration(node) &&
                node.name?.getText() === reflection.name
            ) {
                // TypeScript 4.x decorators property exists at runtime but varies across TS versions
                // Using 'as any' because decorator API changed between TS 4.x and 5.x
                const nodeDecorators = (node as any).decorators;
                if (nodeDecorators) {
                    decorators = nodeDecorators.map((decorator: any) => {
                        const expression = decorator.expression;
                        let name = '';
                        let args: any = {};

                        if (ts.isCallExpression(expression)) {
                            name = expression.expression.getText();
                            if (expression.arguments.length > 0) {
                                args = {
                                    _config: expression.arguments[0].getText(),
                                };
                            }
                        } else {
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
    } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Failed to parse decorators:', error);

        return [];
    }
}

function getTypeParams(reflection: DeclarationReflection) {
    return (
        reflection.typeParameters?.map((param) => ({
            name: param.name,
        })) || []
    );
}

function getSources(reflection: DeclarationReflection) {
    // TypeDoc 0.23+ has both fileName (short) and fullFileName (full path)
    // With basePath set correctly, fileName is relative to project root
    return reflection.sources?.map((source) => source.fileName) || [];
}
