import React from 'react';
import { FormLayoutOptions, FormLayoutType } from '../form.types';
import { LimeJSONSchema } from '../internal.types';
import { renderDescription, renderTitle } from './common';
import { GridLayout } from './grid-layout';
import { LimeObjectFieldTemplateProps, ObjectFieldProperty } from './types';

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
        renderTitle(props.title),
        renderDescription(props.description),
        renderProperties(props.properties, props.schema)
    );
}

function renderCollapsibleField(props: LimeObjectFieldTemplateProps) {
    const defaultOpen = !isCollapsed(props.schema);

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
        renderDescription(props.description),
        renderProperties(props.properties, props.schema)
    );
}

function getSchemaObjectPropertyPath(schema: any, subSchema: LimeJSONSchema) {
    const refPrefixLength = 2;
    const matchAllForwardSlashes = /\//g;
    const rootPath = (schema.$ref as string)
        .replace(matchAllForwardSlashes, '.')
        .slice(refPrefixLength);
    const subSchemaPath = subSchema.$id?.replace('_', '.properties.');

    return subSchemaPath.replace('root', rootPath);
}

function renderProperties(
    properties: ObjectFieldProperty[],
    schema: LimeJSONSchema
) {
    const layout: FormLayoutOptions = schema.lime?.layout;

    return renderLayout(properties, layout);
}

function renderLayout(
    properties: ObjectFieldProperty[],
    layout: FormLayoutOptions
) {
    const type = layout?.type || FormLayoutType.Default;
    const layouts: Record<FormLayoutType, Function> = {
        default: renderDefaultLayout,
        grid: renderGridLayout,
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

function isCollapsible(schema: LimeJSONSchema) {
    return !!schema.lime?.collapsible;
}

function isCollapsed(schema: LimeJSONSchema) {
    return schema.lime.collapsed !== false;
}
