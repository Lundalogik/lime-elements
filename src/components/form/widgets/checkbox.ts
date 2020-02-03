import React from 'react';
import { WidgetProps } from './types';
import { LimeElementsAdapter } from './adapter';

export class Checkbox extends React.Component {
    public refs: any;

    constructor(public props: WidgetProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        const props: WidgetProps = this.props;

        return React.createElement(LimeElementsAdapter, {
            name: 'limel-checkbox',
            value: props.value,
            onChange: this.handleChange,
            widgetProps: props,
            extraProps: {
                checked: !!props.value,
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
