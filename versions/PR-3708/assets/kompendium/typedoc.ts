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

    const options: Partial<TypeDocOptions> = {
        entryPoints: [filename],
        skipErrorChecking: true,
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
    project.traverse(traverseCallback(data));

    return data;
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
    // Convert to relative path from project root
    return (
        reflection.sources?.map((source) => {
            const fullPath = source.fullFileName || source.fileName;

            // WORKAROUND: TypeDoc 0.23 sometimes includes duplicate path prefixes
            // in fullFileName, e.g., "src/kompendium/src/kompendium/file.ts"
            // This appears to happen when TypeDoc resolves paths through symlinks
            // or when the project structure has nested TypeScript configs.
            //
            // The regex matches paths starting with 'src/kompendium/' and optionally
            // captures a duplicate 'src/kompendium/' prefix that we then remove.
            //
            // Examples:
            //   "src/kompendium/src/kompendium/file.ts" → "src/kompendium/file.ts"
            //   "src/kompendium/file.ts" → "src/kompendium/file.ts" (unchanged)
            //
            // FRAGILE: Hard-codes project structure assumptions. If the project
            // is renamed or restructured, this regex will need updating.
            const match = fullPath.match(
                /src\/kompendium\/(?:src\/kompendium\/)?.+$/,
            );
            if (match) {
                // Remove duplicate prefix if present
                return match[0].replace(
                    /^src\/kompendium\/src\/kompendium\//,
                    'src/kompendium/',
                );
            }

            return source.fileName;
        }) || []
    );
}
