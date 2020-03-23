import { get, isEmpty } from 'lodash-es';
import React, { ReactElement } from 'react';
import { isArrayType, isObjectType } from '../schema';
import { LimeElementsAdapter } from '../adapter';
import { TemplateProps } from './types';

export function renderTitle(title: string) {
    if (!title) {
        return;
    }

    return React.createElement(
        'h1',
        { className: 'mdc-typography mdc-typography--headline1' },
        title
    );
}

export function renderDescription(description: string) {
    if (!description) {
        return;
    }

    return React.createElement(
        'p',
        { className: 'mdc-typography mdc-typography--body1' },
        description
    );
}

/**
 * Find a suitable title for a nested structure.
 *
 * If an object has the key 'title' it will have priority, followed by the key 'name'.
 * If 'title' nor 'name' is found, a required item will be considered.
 * Otherwise the first occurrence of a nonempty string is chosen.
 *
 * @param {*} data the data to find the title for
 * @param {*} fieldSchema schema for the item
 * @param {*} formSchema schema for the form
 *
 * @returns {string} describing title of the data
 */
export function findTitle(data: any, fieldSchema: any, formSchema: any) {
    if (!data) {
        return null;
    }

    if (Array.isArray(data) && isObjectType(fieldSchema.items)) {
        return findTitle(data[0], fieldSchema, formSchema);
    }

    if (Array.isArray(data) || typeof data !== 'object') {
        return findSchemaTitle(data, fieldSchema);
    }

    const subSchema = findSubSchema(fieldSchema, formSchema);

    data = sortDataByProperties(data, subSchema.properties);

    const firstEntry = findFirstEntry(data, subSchema);
    if (!firstEntry) {
        return null;
    }

    const [key, value] = firstEntry;
    return findTitle(value, subSchema.properties[key], formSchema);
}

/**
 * Renders a custom template adapter. To be used to override the default template in react-jsonschema-form
 * for a specific subSchema
 *
 * @param {TemplateProps} templateProps The template props
 *
 * @returns {ReactElement} The element
 */
export function renderCustomTemplateAdapter(
    templateProps: TemplateProps
): ReactElement {
    return React.createElement(LimeElementsAdapter, {
        name: templateProps.schema.lime?.template?.name,
        elementProps: {
            templateProps: templateProps,
            ...(templateProps.schema.lime?.template?.props || {}),
        },
    });
}

function sortDataByProperties(data: any, properties: object) {
    if (!properties || isEmpty(properties)) {
        return data;
    }

    const newData = {};
    Object.keys(properties).forEach((key) => (newData[key] = data[key]));
    return newData;
}

function findFirstEntry(data: any, subSchema: any) {
    const entries = [
        ['title', data.title],
        ['name', data.name],
        getRequiredEntry(data, subSchema),
        ...Object.entries(data),
    ];

    return entries.filter(([_, value]) => !!value)[0];
}

function getRequiredEntry(data: any, subSchema: any) {
    if (!('required' in subSchema)) {
        return [null, null];
    }
    const firstNonEmptyRequiredKey = Object.keys(data).find((key) =>
        subSchema.required.includes(key)
    );
    if (!firstNonEmptyRequiredKey) {
        return [null, null];
    }

    return [firstNonEmptyRequiredKey, data[firstNonEmptyRequiredKey]];
}

function findSubSchema(schema: any, formSchema: any) {
    let subSchema = schema;
    if (isArrayType(schema)) {
        subSchema = schema.items;
    }

    if (subSchema.$ref) {
        const path = subSchema.$ref.split('/').slice(1).join('.');
        subSchema = get(formSchema, path);
    }
    return subSchema;
}

function findSchemaTitle(value: any, schema: any) {
    if (isArrayType(schema) && schema.items.anyOf) {
        const titles = schema.items.anyOf
            .filter((item) => value.includes(item.const))
            .map((item) => item.title);
        return titles.join(', ');
    }

    if (schema.oneOf) {
        return schema.oneOf.find((item) => value === item.const).title;
    }

    return value;
}
