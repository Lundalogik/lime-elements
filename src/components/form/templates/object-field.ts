import React from 'react';
import { renderDescription, renderTitle } from './common';
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

function isCollapsible(schema: any) {
    return !!schema.lime?.collapsible;
}
