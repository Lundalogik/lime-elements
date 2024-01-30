import React from 'react';
import { InputType } from '../../input-field/input-field.types';
import { isIntegerType, isNumberType } from '../schema';
import { WidgetProps } from './types';
import { LimeElementsWidgetAdapter } from '../adapters';
import { Slider } from './slider';

export class InputField extends React.Component {
    constructor(public props: WidgetProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        const props: WidgetProps = this.props;

        if (isRange(props.schema)) {
            return React.createElement(Slider, props);
        }

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
        event.stopPropagation();
        const props = this.props;
        const type = getInputType(props.schema);

        if (!props.onChange) {
            return;
        }

        let value: string;
        if (event.detail || typeof event.detail === 'number') {
            value = event.detail;
        } else if (type === 'number') {
            value = null;
        } else {
            value = props.required ? null : '';
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
    let props: any = {};

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

    if (schema.lime?.component?.props) {
        props = {
            ...props,
            ...schema.lime.component.props,
        };
    }

    return props;
}

function isRange(schema: any): boolean {
    if (!isNumberType(schema) && !isIntegerType(schema)) {
        return false;
    }

    return 'minimum' in schema && 'maximum' in schema && 'multipleOf' in schema;
}
