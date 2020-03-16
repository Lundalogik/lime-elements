import React from 'react';
import { WidgetProps } from './types';
import { LimeElementsAdapter } from './adapter';

export class WebComponent extends React.Component {
    public refs: any;

    constructor(public props: WidgetProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        const props: WidgetProps = this.props;

        return React.createElement(LimeElementsAdapter, {
            name: props.schema.lime.component.name,
            value: props.value,
            onChange: this.handleChange,
            widgetProps: props,
            extraProps: {
                widgetProps: props,
                ...(props.schema.lime?.component?.props || {}),
            },
            ...(props.schema.lime?.component?.props || {}),
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
