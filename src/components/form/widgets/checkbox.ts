import React from 'react';
import { WidgetProps } from './types';
import { LimeElementsWidgetAdapter } from '../adapters';

export class Checkbox extends React.Component {
    public refs: any;

    constructor(public props: WidgetProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        const props: WidgetProps = this.props;

        return React.createElement(LimeElementsWidgetAdapter, {
            name: 'limel-checkbox',
            value: props.value,
            widgetProps: props,
            extraProps: {
                checked: !!props.value,
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
