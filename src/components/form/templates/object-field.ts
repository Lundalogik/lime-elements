import React from 'react';
import { ObjectFieldProperty, ObjectFieldTemplateProps } from './types';

export const ObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
    const id = props.idSchema.$id;
    if (id === 'root' || !isCollapsible(props.schema)) {
        return renderFieldWithTitle(props);
    }

    if (isCollapsible(props.schema)) {
        return renderCollapsibleField(props);
    }

    return renderProperties(props.properties);
};

function renderFieldWithTitle(props: ObjectFieldTemplateProps) {
    return React.createElement(
        'div',
        {},
        renderTitle(props.title),
        renderDescription(props.description),
        renderProperties(props.properties)
    );
}

function renderCollapsibleField(props: ObjectFieldTemplateProps) {
    return React.createElement(
        'limel-collapsible-section',
        {
            header: props.title,
        },
        renderDescription(props.description),
        renderProperties(props.properties)
    );
}

function renderProperties(properties: ObjectFieldProperty[]) {
    return properties.map(element => element.content);
}

function renderTitle(title: string) {
    if (!title) {
        return;
    }

    return React.createElement(
        'h1',
        { className: 'mdc-typography mdc-typography--headline1' },
        title
    );
}

function renderDescription(description: string) {
    if (!description) {
        return;
    }

    return React.createElement(
        'p',
        { className: 'mdc-typography mdc-typography--body1' },
        description
    );
}

function isCollapsible(schema: any) {
    return !!schema.lime?.collapsible;
}
