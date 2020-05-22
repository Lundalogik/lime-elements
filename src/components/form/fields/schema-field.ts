import { LimeElementsAdapter } from '../adapter';
import JSONSchemaField from 'react-jsonschema-form/lib/components/fields/SchemaField';
import React from 'react';
import { FieldProps } from './types';

const hasOverridenField = (schema): boolean => {
    return Boolean(schema.lime?.overrides?.field?.name);
};

const getOverridenField = (
    schema
): { name: string; props: { [key: string]: any } } => {
    const name = schema.lime?.overrides?.field?.name;
    const props = schema.lime?.overrides?.field?.props || {};

    return { name: name, props: props };
};

export const SchemaField = (props: FieldProps) => {
    const handleChange = (event) => {
        event.stopPropagation();
        props.onChange(event.detail);
    };

    if (hasOverridenField(props.schema)) {
        const { name, props: overridenFieldProps } = getOverridenField(
            props.schema
        );
        return React.createElement(LimeElementsAdapter, {
            name: name,
            elementProps: {
                fieldProps: props,
                ...overridenFieldProps,
            },
            events: {
                change: handleChange,
            },
        });
    }

    return React.createElement(JSONSchemaField, props);
};
