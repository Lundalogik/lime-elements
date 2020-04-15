import { LimeElementsAdapter } from '../adapter';
import JSONSchemaField from 'react-jsonschema-form/lib/components/fields/SchemaField';
import React from 'react';
import { FieldProps } from './types';
import { isEqual } from 'lodash-es';
import { getDefaultFormState } from 'react-jsonschema-form/lib/utils';

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
    const handleChange = event => {
        event.stopPropagation();
        props.onChange(event.detail);
    };

    let prevFormData = null;
    let curFormData = props.formData;

    while (!isEqual(prevFormData, curFormData)) {
        console.log('FORM DATA DOES NOT MATCH', prevFormData, curFormData);
        prevFormData = curFormData;

        curFormData = getDefaultFormState(
            props.schema,
            curFormData,
            props.registry.definitions
        );
    }

    const fieldProps = {
        ...props,
        formData: curFormData
    };

    if (hasOverridenField(props.schema)) {
        console.log('OVERRIDEN SCHEMA FIELD', props);

        const { name, props: overridenFieldProps } = getOverridenField(
            props.schema
        );
        return React.createElement(LimeElementsAdapter, {
            name: name,
            elementProps: {
                fieldProps: fieldProps,
                ...overridenFieldProps
            },
            events: {
                change: handleChange
            }
        });
    }

    return React.createElement(JSONSchemaField, fieldProps);
};
