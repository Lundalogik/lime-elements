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
            renderProperties(props.properties, props.schema)
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
        renderProperties(props.properties, props.schema)
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
