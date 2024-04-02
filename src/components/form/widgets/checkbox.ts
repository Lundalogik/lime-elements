import React from 'react';
import { WidgetProps } from './types';
import { LimeElementsWidgetAdapter } from '../adapters';
import { FormSchema } from '../form.types';

export class Checkbox extends React.Component {
    public refs: any;

    constructor(public props: WidgetProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        const props: WidgetProps = this.props;
        const additionalProps = getAdditionalProps(props.schema);

        return React.createElement(LimeElementsWidgetAdapter, {
            name: 'limel-checkbox',
            value: props.value,
            widgetProps: props,
            extraProps: {
                checked: !!props.value,
                ...additionalProps,
            },
            events: {
                change: this.handleChange,
            },
        });
    }

    private handleChange(event: CustomEvent<boolean>) {
        const props = this.props;
        event.stopPropagation();

        if (!props.onChange) {
            return;
        }

        props.onChange(event.detail);
    }
}

function getAdditionalProps(schema: FormSchema) {
    return schema.lime?.component?.props ?? {};
}
