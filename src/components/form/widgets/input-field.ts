import React from 'react';
import { InputType } from '@limetech/lime-elements';
import { isIntegerType, isNumberType } from '../schema';
import { WidgetProps } from './types';
import { LimeElementsWidgetAdapter } from '../adapters';

export class InputField extends React.Component {
    constructor(public props: WidgetProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        const props: WidgetProps = this.props;
        const type: InputType = getInputType(props.schema);
        const step: number | 'any' = getStepSize(props.schema);
        const additionalProps = getAdditionalProps(props.schema);

        return React.createElement(LimeElementsWidgetAdapter, {
            name: 'limel-input-field',
            value: props.value,
            events: {
                change: this.handleChange,
            },
            widgetProps: props,
            extraProps: {
                step: step,
                type: type,
                ...additionalProps,
            },
        });
    }

    private handleChange(event: CustomEvent<string>) {
        const props = this.props;
        event.stopPropagation();
        if (!props.onChange) {
            return;
        }

        let value = null;
        if (event.detail !== '') {
            value = event.detail;
        }

        props.onChange(value);
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
