import { LimeElementsAdapter } from '../adapters';
import JSONSchemaField from 'react-jsonschema-form/lib/components/fields/SchemaField';
import React from 'react';
import { FieldProps } from './types';
import { isEmpty, capitalize } from 'lodash-es';

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

export class SchemaField extends React.Component<FieldProps> {
    state = {
        modified: false,
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
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
            return capitalize(errorSchema.__errors[0]);
        }

        return schema.description;
    }

    private getValue() {
        const { formData } = this.props;

        return formData;
    }

    private handleChange(event) {
        event.stopPropagation();

        this.setState({ modified: true });

        this.props.onChange(event.detail);
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

        return {
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
                change: this.handleChange,
            },
        });
    }

    render() {
        if (hasCustomComponent(this.props.schema)) {
            return this.renderCustomComponent(this.props);
        }

        return React.createElement(JSONSchemaField, this.props);
    }
}
