import React from 'react';
import {
    FormLayoutType,
    LimeLayoutOptions,
    FormLayoutOptions,
    FormSchema,
} from '../form.types';
import { renderDescription, renderTitle } from './common';
import { GridLayout } from './grid-layout';
import { RowLayout } from './row-layout';
import { LimeObjectFieldTemplateProps, ObjectFieldProperty } from './types';
import { JSONSchema7 } from 'json-schema';
import { getHelpComponent } from '../help';

export const ObjectFieldTemplate = (props: LimeObjectFieldTemplateProps) => {
    const id = props.idSchema.$id;
    if (id === 'root' || !isCollapsible(props.schema)) {
        return renderFieldWithTitle(props);
    }

    if (isCollapsible(props.schema)) {
        return renderCollapsibleField(props);
    }

    return renderProperties(props.properties, props.schema);
};

function renderFieldWithTitle(props: LimeObjectFieldTemplateProps) {
    return React.createElement(
        React.Fragment,
        {},
        renderSectionHeader(props),
        renderDescription(props.description),
        renderProperties(props.properties, props.schema)
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

    return React.createElement(
        'limel-collapsible-section',
        {
            header: props.title,
            id: getSchemaObjectPropertyPath(
                props.formContext.schema,
                props.idSchema
            ),
            'is-open': defaultOpen,
        },
        helpElement,
        renderDescription(props.description),
        renderProperties(props.properties, props.schema)
    );
}

function getSchemaObjectPropertyPath(
    schema: JSONSchema7,
    subSchema: JSONSchema7
) {
    const refPrefixLength = 2;
    const matchAllForwardSlashes = /\//g;
    const rootPath = (schema.$ref as string)
        ?.replace(matchAllForwardSlashes, '.')
        .slice(refPrefixLength);
    const subSchemaPath = subSchema.$id?.replace('_', '.properties.');

    return subSchemaPath.replace('root', rootPath);
}

function renderProperties(
    properties: ObjectFieldProperty[],
    schema: JSONSchema7
) {
    const layout = schema.lime?.layout;

    return renderLayout(properties, layout);
}

function renderLayout(
    properties: ObjectFieldProperty[],
    layout: Partial<LimeLayoutOptions>
) {
    const type = layout?.type || 'default';
    const layouts: Record<FormLayoutType, Function> = {
        default: renderDefaultLayout,
        grid: renderGridLayout,
        row: renderRowLayout,
    };

    return layouts[type](properties, layout);
}

function renderDefaultLayout(properties: ObjectFieldProperty[]) {
    return React.createElement(
        'div',
        {
            className: 'limel-form-layout--default',
        },
        properties.map((element) => element.content)
    );
}

function renderGridLayout(
    properties: ObjectFieldProperty[],
    layout: FormLayoutOptions
) {
    return React.createElement(
        GridLayout,
        {
            options: layout,
        },
        properties.map((element) => element.content)
    );
}

function renderRowLayout(properties: ObjectFieldProperty[]) {
    return React.createElement(
        RowLayout,
        {},
        properties.map((element) => element.content)
    );
}

function isCollapsible(schema: JSONSchema7) {
    return !!schema.lime?.collapsible;
}

function isCollapsed(schema: JSONSchema7) {
    return schema.lime.collapsed !== false;
}
