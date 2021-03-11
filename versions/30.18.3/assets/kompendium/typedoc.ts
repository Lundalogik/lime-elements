import {
    Application,
    Reflection,
    ReflectionKind,
    DeclarationReflection,
    TypeDocAndTSOptions,
} from 'typedoc';
import {
    CommentTag,
    ParameterReflection,
    SignatureReflection,
} from 'typedoc/dist/lib/models';
import {
    JsonDocsTag,
    JsonDocsProp,
    JsonDocsMethodReturn,
} from '@stencil/core/internal';
import negate from 'lodash/negate';
import {
    InterfaceDescription,
    AliasDescription,
    EnumDescription,
    EnumMember,
    TypeDescription,
    MethodDescription,
    ParameterDescription,
} from '../types';
import { existsSync } from 'fs';

interface MethodSignature {
    parameters: ParameterDescription[];
    returns: JsonDocsMethodReturn;
}

export function parseFile(filename: string): TypeDescription[] {
    if (!existsSync(filename)) {
        console.warn('typeRoot file does not exist', filename);

        return [];
    }

    const app = new Application();
    const options: Partial<TypeDocAndTSOptions> = {
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

    const data: TypeDescription[] = [];
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
    data: InterfaceDescription[]
) {
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

function addSignature(reflection: SignatureReflection, data: MethodSignature) {
    data.parameters = [];
    data.returns = {
        type: reflection.type.toString(),
        docs:
            reflection.parent.parent.comment?.tags?.find(isReturns).text || '',
    };

    reflection.traverse(traverseCallback(data));
}

function addParam(reflection: ParameterReflection, data: MethodSignature) {
    data.parameters.push({
        name: reflection.name,
        type: reflection.type.toString(),
        docs:
            reflection.parent.parent.parent.comment?.tags
                ?.filter(isParam)
                .find((tag) => tag.paramName === reflection.name)
                ?.text.trim() || '',
        default: reflection.defaultValue,
        optional: reflection.flags.isOptional,
    });
}

function addType(reflection: DeclarationReflection, data: AliasDescription[]) {
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

function addEnum(reflection: DeclarationReflection, data: EnumDescription[]) {
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

function addEnumMember(reflection: DeclarationReflection, data: EnumMember[]) {
    data.push({
        name: reflection.name,
        docs: getDocs(reflection),
        docsTags: getDocsTags(reflection),
        value: reflection.defaultValue,
    });
}

function getDocs(reflection: Reflection): string {
    return [reflection.comment?.shortText, reflection.comment?.text]
        .join('\n')
        .trim();
}

function getDocsTags(reflection: DeclarationReflection) {
    return reflection.comment?.tags?.map(getTag) || [];
}

function getTag(tag: CommentTag): JsonDocsTag {
    return {
        name: tag.tagName,
        text: tag.text.trim(),
    };
}

function isProperty(reflection: DeclarationReflection): boolean {
    return (
        reflection.kind === ReflectionKind.Property &&
        reflection.type.toString() !== 'function'
    );
}

function isMethod(reflection: DeclarationReflection): boolean {
    return (
        reflection.kind === ReflectionKind.Property &&
        reflection.type.toString() === 'function'
    );
}

function isParam(tag: CommentTag): boolean {
    return tag.tagName === 'param';
}

function isReturns(tag: CommentTag): boolean {
    return tag.tagName === 'returns';
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
    const signature = getSignature(reflection);

    return {
        name: reflection.name,
        docs: getDocs(reflection),
        docsTags: reflection.comment.tags
            ?.filter(negate(isParam))
            .filter(negate(isReturns))
            .map(getTag),
        ...signature,
    };
}

function getSignature(reflection: Reflection): MethodSignature {
    const signature: Partial<MethodSignature> = {};
    reflection.traverse(traverseCallback(signature));

    return signature as MethodSignature;
}

function getTypeParams(reflection: DeclarationReflection) {
    return (
        reflection.typeParameters?.map((param) => ({
            name: param.name,
        })) || []
    );
}

function getSources(reflection: DeclarationReflection) {
    return reflection.sources.map((source) => source.file.fullFileName);
}
