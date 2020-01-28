import { get } from 'lodash-es';
import React from 'react';
import { isArrayType, isObjectType } from '../schema';

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
 * Find the first string item in a nested structure.
 *
 * If an object has the key 'title' it will have priority, followed by the key 'name'
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

    const firstEntry = findFirstEntry(data);
    if (!firstEntry) {
        return null;
    }

    const [key, value] = firstEntry;
    const subSchema = findSubSchema(fieldSchema, key, formSchema);

    return findTitle(value, subSchema, formSchema);
}

function findFirstEntry(data: any) {
    const entries = [
        ['title', data.title],
        ['name', data.name],
        ...Object.entries(data),
    ];

    return entries.filter(([_, value]) => !!value)[0];
}

function findSubSchema(schema: any, key: any, formSchema: any) {
    let subSchema = schema;
    if (isArrayType(schema)) {
        subSchema = schema.items;
    }

    if (subSchema.$ref) {
        const path = subSchema.$ref
            .split('/')
            .slice(1)
            .join('.');
        subSchema = get(formSchema, path);
    }

    return subSchema.properties[key];
}

function findSchemaTitle(value: any, schema: any) {
    if (isArrayType(schema) && schema.items.anyOf) {
        const titles = schema.items.anyOf
            .filter(item => value.includes(item.const))
            .map(item => item.title);
        return titles.join(', ');
    }

    if (schema.oneOf) {
        return schema.oneOf.find(item => value === item.const).title;
    }

    return value;
}
