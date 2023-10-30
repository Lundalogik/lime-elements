import React from 'react';
import { Option } from '../../select/option.types';
import { isMultiple } from '../../../util/multiple';
import { LimeElementsWidgetAdapter } from '../adapters';
import { WidgetProps } from './types';

export class Select extends React.Component {
    public state = {
        modified: false,
    };

    constructor(public props: WidgetProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        const props: WidgetProps = this.props;
        const enumOptions: any[] = props.options.enumOptions as any[];
        const options = enumOptions.map(createOption);
        let value: any;

        if (props.multiple) {
            value = findValues(props.value, options);
        } else {
            value = findValue(props.value, options);
        }

        const additionalProps = props.schema.lime?.component?.props || {};

        return React.createElement(LimeElementsWidgetAdapter, {
            name: 'limel-select',
            value: value,
            events: {
                change: this.handleChange,
            },
            widgetProps: props,
            extraProps: {
                multiple: props.multiple,
                options: options,
                ...additionalProps,
            },
        });
    }

    private handleChange(event: CustomEvent<Option | Option[]>) {
        const props = this.props;
        event.stopPropagation();

        if (!props.onChange) {
            return;
        }

        if (isMultiple(event.detail)) {
            const value = event.detail.map((option) => option.value);
            props.onChange(value);

            return;
        }

        props.onChange(event.detail.value);
    }
}

function createOption(item: {
    label: string;
    value: string;
    schema: Record<string, unknown>;
}): Option {
    return {
        text: item.label,
        value: item.value,
        disabled: !!item.schema.readOnly,
    };
}

function findValue(value: string, options: Option[]) {
    return options.find((option: Option) => option.value === value);
}

function findValues(value: string[], options: Option[]) {
    return options.filter((option: Option) => value.includes(option.value));
}
