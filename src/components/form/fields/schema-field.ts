import { LimeElementsAdapter } from '../adapters';
import JSONSchemaField from 'react-jsonschema-form/lib/components/fields/SchemaField';
import React from 'react';
import { FieldProps } from './types';
import { isEmpty, capitalize } from 'lodash-es';
import { resetDependentFields } from './field-helpers';

/**
 * If given a value and schema, check if the value should be translated
 * from null to undefined to avoid issues with validation
 *
 * This function needs to be used for several reasons:
 * 1. CustomEvent does not allow `detail` to equal `undefined`, but we can call onChange with `undefined` in React
 * 2. `null` is treated as a valid value in a jsonschema and with marshmallow and it has its own type (null)
 * 3. Without changing `null` to `undefined` there would be no way to remove a field from
 * from the submitted form data once it had any data. (when POSTing, undefined is not posted since its not valid json)
 * 4. The only applies to custom web components since widgets handle transforming null/'' to undefined depending on the widget
 * and its purpose.
 *
 * Example:
 * If I have an object { name?: string, email?: string } that I am using a custom web component for `name`,
 * then initially, the formData will be {} which is fine because neither name or email are required. Then if i input a
 * value for name the formData will be { name: 'some_value' } which is also fine. But then if I want to remove name
 * from the form data I would delete all the text from the name input field. Web components would emit this empty value
 * as '' or null. If the web component tries to emit `undefined`, null would be emitted instead because CustomEvent has
 * a default `detail` value of null
 *
 * @param {any} value the value associated with the schema
 * @param {any} schema the schema for the value
 *
 * @returns {boolean} whether or not null should be changed to undefined
 */
const shouldChangeToUndefined = (value, schema): boolean => {
    return value === null && !schema.type.includes('null');
};

const hasCustomComponent = (schema): boolean => {
    return Boolean(schema.lime?.component?.name);
};

const verifyCustomComponentIsDefined = (elementName): void => {
    const supportsCustomElements = 'customElements' in window;

    if (!supportsCustomElements) {
        throw new Error(
            'Custom form elements are not supported by this browser!'
        );
    }

    if (!customElements.get(elementName)) {
        throw new Error(`Custom form element '${elementName}' is not defined!`);
    }
};

const getCustomComponent = (
    schema
): { name: string; props: { [key: string]: any } } => {
    const name = schema.lime?.component?.name;
    const props = schema.lime?.component?.props || {};

    return { name: name, props: props };
};

/**
 * Create properties from the factory that is set on `limel-form`
 *
 * @param {*} formContext the form context
 * @param {*} schema the schema for the current field
 *
 * @returns {object} the properties created by the factory
 */
export function getFactoryProps(
    formContext: any,
    schema: any
): Record<string, any> {
    // eslint-disable-next-line no-shadow
    const factory: (schema: any) => Record<string, any> =
        formContext.propsFactory;
    if (typeof factory !== 'function') {
        return {};
    }

    const props = factory(schema);
    if (!props) {
        return {};
    }

    return props;
}

export class SchemaField extends React.Component<FieldProps> {
    state = {
        modified: false,
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleCustomComponentChange = this.handleCustomComponentChange.bind(
            this
        );
        this.initState();
    }

    private initState() {
        if (this.hasValue()) {
            this.state.modified = true;
        }
    }

    private hasValue() {
        const value = this.getValue();
        if (!value) {
            return false;
        }

        if (Array.isArray(value)) {
            return !!value.length;
        }

        if (typeof value === 'object') {
            return !isEmpty(value);
        }

        return true;
    }

    private getLabel() {
        const { schema } = this.props;

        return schema.title;
    }

    private isInvalid() {
        const { modified } = this.state;
        const { errorSchema } = this.props;

        if (!modified) {
            return false;
        }

        return !isEmpty(errorSchema);
    }

    private isRequired() {
        const { required, schema } = this.props;

        return required || schema.minItems > 0;
    }

    private getHelperText() {
        const { errorSchema, schema } = this.props;

        if (!this.isInvalid()) {
            return schema.description;
        }

        if (!isEmpty(errorSchema)) {
            return capitalize(errorSchema.__errors[0]); // eslint-disable-line no-underscore-dangle
        }

        return schema.description;
    }

    private getValue() {
        const { formData } = this.props;

        return formData;
    }

    private handleCustomComponentChange(event) {
        const { schema } = this.props;
        event.stopPropagation();

        let value = event.detail;

        if (shouldChangeToUndefined(value, schema)) {
            value = undefined;
        }

        this.handleChange(value);
    }

    private handleChange(data) {
        const { formData, schema } = this.props;
        const { definitions } = this.props.registry;

        this.setState({ modified: true });

        const newData = resetDependentFields(
            formData,
            data,
            schema,
            definitions
        );

        this.props.onChange(newData);
    }

    private buildCustomComponentProps() {
        const {
            disabled,
            readonly,
            name,
            registry,
            schema,
            errorSchema,
        } = this.props;
        const factoryProps = getFactoryProps(registry.formContext, schema);

        return {
            ...factoryProps,
            value: this.getValue(),
            required: this.isRequired(),
            readonly: readonly,
            disabled: disabled,
            invalid: this.isInvalid(),
            label: this.getLabel(),
            helperText: this.getHelperText(),
            formInfo: {
                schema: schema,
                rootSchema: registry.formContext.schema,
                errorSchema: errorSchema,
                rootValue: registry.formContext.rootValue,
                name: name,
            },
        };
    }

    private renderCustomComponent(props: FieldProps) {
        const { name, props: userDefinedComponentProps } = getCustomComponent(
            props.schema
        );

        verifyCustomComponentIsDefined(name);

        return React.createElement(LimeElementsAdapter, {
            name: name,
            elementProps: {
                ...userDefinedComponentProps,
                ...this.buildCustomComponentProps(),
            },
            events: {
                change: this.handleCustomComponentChange,
            },
        });
    }

    render() {
        if (hasCustomComponent(this.props.schema)) {
            return this.renderCustomComponent(this.props);
        }

        const fieldProps = {
            ...this.props,
            onChange: this.handleChange,
        };

        return React.createElement(JSONSchemaField, fieldProps);
    }
}
