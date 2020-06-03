import React from 'react';
import JSONSchemaForm from 'react-jsonschema-form';
import {
    retrieveSchema,
    getDefaultFormState,
} from 'react-jsonschema-form/lib/utils';
import { isEqual } from 'lodash-es';

/**
 * Given a schema, populate the defaults of the form data
 *
 * This function is required because react-jsonschema-form
 * does not populate defaults of dependencies of dependencies.
 *
 * @see https://github.com/rjsf-team/react-jsonschema-form/issues/1703
 *
 * @param {object} schema the schema for the associated data. Should be an 'object' schema
 * @param {any} data the data object to populate with defaults
 * @param {object} definitions schema definitions
 *
 * @returns {object} The updated data
 */
const populateDefaults = (schema, data, definitions) => {
    let inputData;
    let outputData = data;
    let prevDataSchema;
    let curDataSchema;

    // Loop and populate defaults until the dataSchema
    // doesn't change and the data doesn't change.
    // The dataSchema is the schema react-jsonschema-form
    // generates for the provided data. So if we populate the data
    // with defaults, we need to rebuild that dataSchema with the defaults
    // populated.
    do {
        inputData = outputData;
        prevDataSchema = curDataSchema;
        curDataSchema = retrieveSchema(schema, definitions, inputData);
        outputData = getDefaultFormState(curDataSchema, inputData, definitions);
    } while (
        !isEqual(inputData, outputData) &&
        !isEqual(prevDataSchema, curDataSchema)
    );

    data = populateDefaultsForProperties(
        curDataSchema.properties,
        outputData,
        definitions
    );

    // Pass the updated data back up the stack
    return data;
};

/**
 * For all properties (from a data schema), recurse
 * over the properties and populate the defaults of the subschema
 *
 * @param {object} properties the properties from the current data schema
 * @param {any} data the data associated with the current data schema
 * @param {object} definitions schema definitions
 *
 * @returns {object} The updated data
 */
const populateDefaultsForProperties = (properties, data, definitions) => {
    for (const prop of Object.keys(properties)) {
        // Only recurse on 'object' properties
        if (properties[prop].type === 'object') {
            const propData = data[prop];
            data = {
                ...data,
                [prop]: populateDefaults(
                    properties[prop],
                    propData,
                    definitions
                ),
            };
        }
    }

    return data;
};

/**
 * This form component exists to manually populate the defaults of the schema
 * before react-jsonschema-form populates the defaults because the react-jsonschema-form
 * is not able to populate the defaults for dependencies of dependencies
 *
 * @see https://github.com/rjsf-team/react-jsonschema-form/issues/1703
 */
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
