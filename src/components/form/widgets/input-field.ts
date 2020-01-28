import React from 'react';
import { InputType } from '../../input-field/input-field.types';
import { isIntegerType, isNumberType } from '../schema';

export class InputField extends React.Component {
    private refs: any;
    private props: any;

    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
    }

    public componentDidMount() {
        const element: HTMLLimelInputFieldElement = this.refs.ref;
        element.addEventListener('change', this.handleChange);
    }

    public componentWillUnmount() {
        const element: HTMLLimelInputFieldElement = this.refs.ref;
        element.removeEventListener('change', this.handleChange);
    }

    public render() {
        const props: any = this.props;
        const type: InputType = getInputType(props.schema);
        const step: number | 'any' = getStepSize(props.schema);
        const additionalProps = getAdditionalProps(props.schema);

        return React.createElement('limel-input-field', {
            type: type,
            value: props.value,
            label: props.label,
            'helper-text': props.schema.description,
            disabled: props.disabled,
            required: props.required,
            step: step,
            ref: 'ref',
            ...additionalProps,
        });
    }

    private handleChange(event: CustomEvent<string>) {
        const props = this.props;
        event.stopPropagation();
        if (!props.onChange) {
            return;
        }

        props.onChange(event.detail);
    }
}

function getInputType(schema: any): InputType {
    if (isNumberType(schema) || isIntegerType(schema)) {
        return 'number';
    }

    if (schema.format === 'email') {
        return 'email';
    }

    return 'text';
}

function getStepSize(schema: any): 'any' | number {
    if (isNumberType(schema) && schema.multipleOf) {
        return parseFloat(schema.multipleOf) || 'any';
    }

    if (isIntegerType(schema)) {
        return parseInt(schema.multipleOf, 10) || 1;
    }

    return 'any';
}

function getAdditionalProps(schema: any) {
    const props: any = {};

    if (schema.minimum) {
        props.min = schema.minimum;
    }

    if (schema.maximum) {
        props.max = schema.maximum;
    }

    if (schema.maxLength) {
        props.maxlength = schema.maxLength;
    }

    if (schema.minLength) {
        props.minlength = schema.minLength;
    }

    return props;
}
