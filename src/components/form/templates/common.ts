import { get, isEmpty } from 'lodash-es';
import React from 'react';
import { isArrayType, isObjectType } from '../schema';
import { FormSchema } from '../form.types';
import { JSONSchema7 } from 'json-schema';

export function renderTitle(title: string) {
    if (!title) {
        return;
    }

    return React.createElement(
        'h1',
        { className: 'mdc-typography mdc-typography--headline1' },
        title,
    );
}

export function renderDescription(description: string) {
    if (!description) {
        return;
    }

    return React.createElement(
        'p',
        { className: 'mdc-typography mdc-typography--body1' },
        description,
    );
}

/**
 * Find a suitable title for a nested structure.
 *
 * If an object has the key 'title' it will have priority, followed by the key 'name'.
 * If 'title' nor 'name' is found, a required item will be considered.
 * Otherwise the first occurrence of a nonempty string is chosen.
 *
 * @param data - the data to find the title for
 * @param fieldSchema - schema for the item
 * @param formSchema - schema for the form
 * @returns describing title of the data
 */
export function findTitle(
    data: any,
    fieldSchema: JSONSchema7,
    formSchema: JSONSchema7,
) {
    if (!data) {
        return null;
    }

    if (Array.isArray(data) && isObjectType(fieldSchema.items as FormSchema)) {
        return findTitle(data[0], fieldSchema, formSchema);
    }

    if (Array.isArray(data) || typeof data !== 'object') {
        return findSchemaTitle(data, fieldSchema);
    }

    const subSchema = findSubSchema(
        fieldSchema as FormSchema,
        formSchema as FormSchema,
    );

    data = sortDataByProperties(data, subSchema.properties);

    const firstEntry = findFirstEntry(data, subSchema);
    if (!firstEntry) {
        return null;
    }

    if (!subSchema.properties) {
        return null;
    }

    const [key, value] = firstEntry;

    return findTitle(value, subSchema.properties[key], formSchema);
}

function sortDataByProperties(data: any, properties: object) {
    if (!properties || isEmpty(properties)) {
        return data;
    }

    const newData = {};
    Object.keys(properties).forEach((key) => (newData[key] = data[key]));

    return newData;
}

function findFirstEntry(data: any, subSchema: FormSchema) {
    const entries = [
        ['title', data.title],
        ['name', data.name],
        getRequiredEntry(data, subSchema),
        ...Object.entries(data),
    ];

    return entries.filter((entry) => {
        const value = entry[1];

        return !!value && typeof value !== 'boolean';
    })[0];
}

function getRequiredEntry(data: any, subSchema: FormSchema) {
    if (!('required' in subSchema)) {
        return [null, null];
    }

    const firstNonEmptyRequiredKey = Object.keys(data).find((key) =>
        subSchema.required.includes(key),
    );
    if (!firstNonEmptyRequiredKey) {
        return [null, null];
    }

    return [firstNonEmptyRequiredKey, data[firstNonEmptyRequiredKey]];
}

function findSubSchema(schema: FormSchema, formSchema: FormSchema) {
    let subSchema = schema;
    if (isArrayType(schema)) {
        subSchema = schema.items as FormSchema;
    }

    if (subSchema.$ref) {
        const path = subSchema.$ref.split('/').slice(1).join('.');
        subSchema = get(formSchema, path);
    }

    return subSchema;
}

function findSchemaTitle(value: any, schema: JSONSchema7) {
    if (
        isArrayType(schema as FormSchema) &&
        (schema.items as JSONSchema7).anyOf
    ) {
        const titles = ((schema.items as JSONSchema7).anyOf as JSONSchema7[])
            .filter((item) => value.includes(item.const))
            .map((item) => item.title);

        return titles.join(', ');
    }

    if (schema.oneOf) {
        return (
            (schema.oneOf as JSONSchema7[]).find((item) => value === item.const)
                ?.title || `${value} is an invalid option`
        );
    }

    return value;
}
