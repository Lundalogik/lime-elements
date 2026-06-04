import React, { useContext } from 'react';
import {
    FormLayoutType,
    LimeLayoutOptions,
    FormLayoutOptions,
    FormSchema,
} from '../form.types';
import { hasNestedErrors, renderDescription, renderTitle } from './common';
import { GridLayout } from './grid-layout';
import { RowLayout } from './row-layout';
import { LimeObjectFieldTemplateProps, ObjectFieldProperty } from './types';
import { JSONSchema7 } from 'json-schema';
import { FieldPathId } from '@rjsf/utils';
import { getHelpComponent } from '../help';
import { ArrayFieldContext } from './array-context';

export const ObjectFieldTemplate = (props: LimeObjectFieldTemplateProps) => {
    const arrayContext = useContext(ArrayFieldContext);
    const id = props.fieldPathId.$id;

    if (arrayContext && id !== 'root') {
        return React.createElement(
            ArrayFieldContext.Provider,
            { value: null },
            renderProperties(
                props.properties,
                props.schema,
                props.fieldPathId.path.map(String)
            )
        );
    }

    if (id === 'root' || !isCollapsible(props.schema)) {
        return renderFieldWithTitle(props);
    }

    return renderCollapsibleField(props);
};

function renderFieldWithTitle(props: LimeObjectFieldTemplateProps) {
    return React.createElement(
        React.Fragment,
        {},
        renderSectionHeader(props),
        renderDescription(props.description as string),
        renderProperties(
            props.properties,
            props.schema,
            props.fieldPathId.path.map(String)
        )
    );
}

function renderSectionHeader(props: LimeObjectFieldTemplateProps) {
    const help = getHelpComponent(props.schema as FormSchema);
    if (!help) {
        return renderTitle(props.title);
    }

    return React.createElement(
        React.Fragment,
        {},
        renderTitle(props.title),
        help
    );
}

function renderCollapsibleField(props: LimeObjectFieldTemplateProps) {
    const defaultOpen = !isCollapsed(props.schema);
    const helpElement = getHelpComponent(props.schema as FormSchema, {
        slot: 'header',
    });
    const revealErrors = props.registry.formContext?.revealErrors === true;
    const invalid = revealErrors && hasNestedErrors(props.errorSchema);

    return React.createElement(
        'limel-collapsible-section',
        {
            header: props.title,
            id: getSchemaObjectPropertyPath(
                props.registry.formContext.schema,
                props.fieldPathId
            ),
            'is-open': defaultOpen,
            invalid: invalid,
        },
        helpElement,
        renderDescription(props.description as string),
        renderProperties(
            props.properties,
            props.schema,
            props.fieldPathId.path.map(String)
        )
    );
}

function getSchemaObjectPropertyPath(
    schema: JSONSchema7,
    fieldPathId: FieldPathId
) {
    const refPrefixLength = 2;
    const matchAllForwardSlashes = /\//g;
    const rootPath =
        (schema.$ref as string)
            ?.replace(matchAllForwardSlashes, '.')
            .slice(refPrefixLength) ?? '';
    const subSchemaPath = fieldPathId.path
        .map((segment) => `.properties.${segment}`)
        .join('');

    return `${rootPath}${subSchemaPath}`;
}

function renderProperties(
    properties: ObjectFieldProperty[],
    schema: JSONSchema7,
    schemaPath: string[]
) {
    const layout = schema.lime?.layout;

    return renderLayout(properties, layout, schemaPath);
}

function renderLayout(
    properties: ObjectFieldProperty[],
    layout: Partial<LimeLayoutOptions>,
    schemaPath: string[]
) {
    const type = layout?.type || 'default';
    const layouts: Record<FormLayoutType, Function> = {
        default: renderDefaultLayout,
        grid: renderGridLayout,
        row: renderRowLayout,
    };

    return layouts[type](properties, layout, schemaPath);
}

function renderDefaultLayout(
    properties: ObjectFieldProperty[],
    _layout: FormLayoutOptions | undefined,
    schemaPath: string[]
) {
    return React.createElement(
        'div',
        {
            className: 'limel-form-layout--default',
            'data-schema-path': toSchemaPath(schemaPath),
        },
        properties.map((element) => element.content)
    );
}

/**
 * Render a schema path as a leading-slash string. Root → `/`,
 * `['rules']` → `/rules`, `['rules', 'details']` → `/rules/details`.
 *
 * @param path the schema-path segments (typically `fieldPathId.path`).
 */
export function toSchemaPath(path: string[]): string {
    return path.length === 0 ? '/' : `/${path.join('/')}`;
}

function renderGridLayout(
    properties: ObjectFieldProperty[],
    layout: FormLayoutOptions,
    schemaPath: string[]
) {
    return React.createElement(
        GridLayout,
        {
            options: layout,
            schemaPath: schemaPath,
        },
        properties.map((element) => element.content)
    );
}

function renderRowLayout(
    properties: ObjectFieldProperty[],
    _layout: FormLayoutOptions | undefined,
    schemaPath: string[]
) {
    return React.createElement(
        RowLayout,
        {
            schemaPath: schemaPath,
        },
        properties.map((element) => element.content)
    );
}

function isCollapsible(schema: JSONSchema7) {
    return !!schema.lime?.collapsible;
}

function isCollapsed(schema: JSONSchema7) {
    return schema.lime.collapsed !== false;
}
