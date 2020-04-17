import React from 'react';
import JSONSchemaForm from 'react-jsonschema-form';
import {
    retrieveSchema,
    getDefaultFormState,
    mergeObjects,
} from 'react-jsonschema-form/lib/utils';
import { isEqual } from 'lodash-es';

function findSchemaDefinition($ref, definitions: any = {}) {
    // Extract and use the referenced definition if we have it.
    const match = /^#\/definitions\/(.*)$/.exec($ref);
    if (match && match[1]) {
        const parts = match[1].split('/');
        let current = definitions;
        for (let part of parts) {
            part = part.replace(/~1/g, '/').replace(/~0/g, '~');
            while (current.hasOwnProperty('$ref')) {
                current = findSchemaDefinition(current.$ref, definitions);
            }
            if (current.hasOwnProperty(part)) {
                current = current[part];
            } else {
                // No matching definition found, that's an error (bogus schema?)
                throw new Error(`Could not find a definition for ${$ref}.`);
            }
        }
        return current;
    }

    // No matching definition found, that's an error (bogus schema?)
    throw new Error(`Could not find a definition for ${$ref}.`);
}

const populateDefaults = (schema, data, definitions) => {
    console.log('Populate Defaults', schema, data);

    if ('$ref' in schema) {
        const ref = findSchemaDefinition(schema.$ref, definitions);
        console.log('Populate Defaults ref', ref);
        schema = mergeObjects(schema, ref);
        delete schema.$ref;
    }

    let inputData;
    let outputData = data;
    let prevDataSchema;
    let curDataSchema;

    do {
        console.log(
            'Populate Defaults loop',
            inputData,
            outputData,
            prevDataSchema,
            curDataSchema
        );
        inputData = outputData;
        prevDataSchema = curDataSchema;
        curDataSchema = retrieveSchema(schema, definitions, inputData);
        console.log('Populate Defaults new data schema', curDataSchema);

        outputData = getDefaultFormState(curDataSchema, inputData, definitions);

        console.log(
            'Populate Defaults loop done',
            inputData,
            outputData,
            prevDataSchema,
            curDataSchema
        );
    } while (
        !isEqual(inputData, outputData) &&
        !isEqual(prevDataSchema, curDataSchema)
    );

    data = outputData;

    for (const prop of Object.keys(curDataSchema.properties)) {
        if (curDataSchema.properties[prop].type === 'object') {
            const propData = data[prop];
            data = {
                ...data,
                [prop]: populateDefaults(
                    curDataSchema.properties[prop],
                    propData,
                    definitions
                ),
            };
        }
    }

    console.log('Populate Defaults done', data);

    return data;
};

export default class Form extends React.Component<any, any> {
    form;

    constructor(props) {
        super(props);
        this.form = React.createRef();
        this.state = {
            nextState: props,
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log('COMPONENT WILL RECIEVE PROPS', nextProps);
        nextProps = {
            ...nextProps,
            formData: populateDefaults(
                nextProps.schema,
                nextProps.formData,
                nextProps.schema.definitions || {}
            ),
        };

        this.setState({ nextState: nextProps });
    }

    validate(value) {
        return this.form.current.validate(value);
    }

    render() {
        const { nextState } = this.state;
        console.log('render overriden form', nextState);
        return React.createElement(
            JSONSchemaForm,
            {
                ...nextState,
                ref: this.form,
            },
            this.props.children
        );
    }
}
