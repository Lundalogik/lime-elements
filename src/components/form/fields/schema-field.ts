import { LimeElementsAdapter } from '../adapter';
import JSONSchemaField from 'react-jsonschema-form/lib/components/fields/SchemaField';
import React from 'react';
import { FieldProps } from './types';
import { union, isEqual, isPlainObject } from 'lodash-es';
import {
    retrieveSchema,
    getDefaultFormState
} from 'react-jsonschema-form/lib/utils';

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

const equals = (a, b) => a === b;

export class SchemaField extends React.Component<FieldProps> {
    currentFormData = {};

    constructor(props: FieldProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.detectDependencyAffectingChanges = this.detectDependencyAffectingChanges.bind(
            this
        );
    }

    handleChange(event) {
        event.stopPropagation();

        console.log('Schema Field Change', event.detail);
        this.detectDependencyAffectingChanges(event.detail);
    }

    detectDependencyAffectingChanges(data) {
        console.log(
            'Schema Field detecting dependency changes',
            data,
            this.props,
            isPlainObject(data)
        );

        // Dependencies only exist on object types
        if (isPlainObject(data)) {
            console.log('Schema Field comparing', this.currentFormData, data);

            // Get the keys that have changed between the current data and the new data
            // If the current data is undefined, all the keys have changed
            const changedKeys = this.currentFormData
                ? this.getDifferentKeys(this.currentFormData, data)
                : Object.keys(data);

            console.log('Schema Field changed keys', changedKeys);

            // Get the new schema that is calculated for the new data
            const newSchema =
                '$ref' in this.props.schema
                    ? retrieveSchema(
                          this.props.schema,
                          this.props.registry.definitions,
                          data
                      )
                    : this.props.schema;

            console.log('Schema Field changed got schema', newSchema);

            // For each key that was changed in the data, remove to calculate the
            // test schema that is generated without that key. We do this because by
            // doing so we can see which keys change whether or not that data exists
            // and therefore can determine the dependencies of that field
            for (const key of changedKeys) {
                // Get test schema with changed key removed
                // const testData = { ...data, [key]: undefined };
                const currentSchema =
                    '$ref' in this.props.schema
                        ? retrieveSchema(
                              this.props.schema,
                              this.props.registry.definitions,
                              this.currentFormData
                          )
                        : this.props.schema;
                console.log(
                    'Schema Field changed got test schema with key removed',
                    key,
                    currentSchema,
                    this.currentFormData
                );

                // Get the properties that change when the key is removed.
                // This should return us all keys that are dependent on the key
                // that we just removed from the data
                const dependentPropertyKeys = this.getDifferentKeys(
                    newSchema.properties,
                    currentSchema.properties,
                    isEqual
                );

                console.log(
                    'Schema Field properties dependent on',
                    key,
                    dependentPropertyKeys
                );

                // Reset keys that are dependent on the changed value
                // the values for these dependent fields will be repopulated
                // with defaults during the next render
                for (const dependentPropertyKey of dependentPropertyKeys) {
                    delete data[dependentPropertyKey];
                    // const { [dependentPropertyKey]: _, ...newData } = data;
                    // data = newData;
                }
            }

            console.log('Schema Field new data', data);
        }

        this.props.onChange(data);
    }

    getDifferentKeys(a: object, b: object, equalsFunc = equals): any[] {
        const keys = union(Object.keys(a), Object.keys(b));
        return keys.filter(key => {
            return !equalsFunc(b[key], a[key]);
        });
    }

    render() {
        let prevFormData;
        this.currentFormData = this.props.formData;

        while (!isEqual(prevFormData, this.currentFormData)) {
            console.log(
                'FORM DATA DOES NOT MATCH',
                prevFormData,
                this.currentFormData
            );
            prevFormData = this.currentFormData;

            this.currentFormData = getDefaultFormState(
                this.props.schema,
                this.currentFormData,
                this.props.registry.definitions
            );
        }

        console.log('FORM DATA CALCULATED WITH DEFAULTS', this.currentFormData);

        const fieldProps = {
            ...this.props,
            formData: this.currentFormData,
            onChange: this.detectDependencyAffectingChanges
        };

        if (hasOverridenField(this.props.schema)) {
            console.log('OVERRIDEN SCHEMA FIELD', this.props);

            const { name, props: overridenFieldProps } = getOverridenField(
                this.props.schema
            );
            return React.createElement(LimeElementsAdapter, {
                name: name,
                elementProps: {
                    fieldProps: fieldProps,
                    ...overridenFieldProps
                },
                events: {
                    change: this.handleChange
                }
            });
        }

        return React.createElement(JSONSchemaField, fieldProps);
    }
}
