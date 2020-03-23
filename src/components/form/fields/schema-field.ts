import { LimeElementsAdapter } from '../adapter';
import JSONSchemaField from 'react-jsonschema-form/lib/components/fields/SchemaField';
import React from 'react';
import { FieldProps } from './types';

export const SchemaField = (props: FieldProps) => {
    const handleChange = event => {
        event.stopPropagation();
        props.onChange(event.detail);
    };

    if (props.schema.lime?.component?.name) {
        console.log('rendering custom schema field', props);
        return React.createElement(LimeElementsAdapter, {
            name: props.schema.lime?.component?.name,
            elementProps: {
                fieldProps: props,
                ...(props.schema.lime?.component?.props || {}),
            },
            events: {
                change: handleChange,
            },
        });
    }

    return React.createElement(JSONSchemaField, props);
};
