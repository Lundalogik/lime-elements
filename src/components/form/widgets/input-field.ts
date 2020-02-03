import React from 'react';
import { InputType } from '@limetech/lime-elements';
import { isIntegerType, isNumberType, getHelperText } from '../schema';
import { WidgetProps } from './types';

export class InputField extends React.Component {
    public refs: any;
    public state = {
        modified: false
    };

    constructor(public props: WidgetProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    public componentDidMount() {
        const element: HTMLLimelInputFieldElement = this.refs.ref;
        element.addEventListener('change', this.handleChange);
        element.addEventListener('blur', this.handleBlur);
    }

    public componentWillUnmount() {
        const element: HTMLLimelInputFieldElement = this.refs.ref;
        element.removeEventListener('change', this.handleChange);
        element.removeEventListener('blur', this.handleBlur);
    }

    public render() {
        const props: WidgetProps = this.props;
        const type: InputType = getInputType(props.schema);
        const step: number | 'any' = getStepSize(props.schema);
        const additionalProps = getAdditionalProps(props.schema);

        return React.createElement('limel-input-field', {
            type: type,
            value: props.value,
            label: props.label,
            'helper-text': getHelperText(props.schema, !this.isInvalid(), props.rawErrors),
            disabled: props.disabled,
            required: props.required,
            invalid: this.isInvalid(),
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

    private handleBlur() {
        this.setState({
            modified: true
        });
    }

    private isInvalid() {
        if (!this.state.modified) {
            return false;
        }

        return !!this.props.rawErrors;
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
