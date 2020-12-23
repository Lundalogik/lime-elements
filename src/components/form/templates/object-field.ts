import React from 'react';
import { FormLayoutOptions, FormLayoutType } from '../form.types';
import { renderDescription, renderTitle } from './common';
import { GridLayout } from './grid-layout';
import { ObjectFieldProperty, ObjectFieldTemplateProps } from './types';

export const ObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
    const id = props.idSchema.$id;
    if (id === 'root' || !isCollapsible(props.schema)) {
        return renderFieldWithTitle(props);
    }

    if (isCollapsible(props.schema)) {
        return renderCollapsibleField(props);
    }

    return renderProperties(props.properties, props.schema);
};

function renderFieldWithTitle(props: ObjectFieldTemplateProps) {
    return React.createElement(
        React.Fragment,
        {},
        renderTitle(props.title),
        renderDescription(props.description),
        renderProperties(props.properties, props.schema)
    );
}

function renderCollapsibleField(props: ObjectFieldTemplateProps) {
    return React.createElement(
        'limel-collapsible-section',
        {
            header: props.title,
        },
        renderDescription(props.description),
        renderProperties(props.properties, props.schema)
    );
}

function renderProperties(properties: ObjectFieldProperty[], schema: any) {
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

function isCollapsible(schema: any) {
    return !!schema.lime?.collapsible;
}
