import React from 'react';
import { LimeElementsWidgetAdapter } from '../adapters';
import { WidgetProps } from './types';
import { FormSchema } from '../form.types';

export class Slider extends React.Component {
    constructor(public props: WidgetProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        const props: WidgetProps = this.props;
        const schema = props.schema;
        let factor;
        let unit;
        const additionalProps = getAdditionalProps(props.schema);

        if (isPercent(schema)) {
            factor = 100;
            unit = '%';
        }

        return React.createElement(LimeElementsWidgetAdapter, {
            name: 'limel-slider',
            value: props.value,
            events: {
                change: this.handleChange,
            },
            widgetProps: props,
            extraProps: {
                valuemin: schema.minimum,
                valuemax: schema.maximum,
                step: schema.multipleOf,
                factor: factor,
                unit: unit,
                ...additionalProps,
            },
        });
    }

    private handleChange(event: CustomEvent<number>) {
        const props = this.props;
        event.stopPropagation();

        if (!props.onChange) {
            return;
        }

        props.onChange(event.detail);
    }
}

function isPercent(schema: FormSchema): boolean {
    return (
        schema.multipleOf < 1 && schema.minimum === 0 && schema.maximum === 1
    );
}

function getAdditionalProps(schema: FormSchema) {
    let props: any = {};

    if (schema.lime?.component?.props) {
        props = {
            ...props,
            ...schema.lime.component.props,
        };
    }

    return props;
}
