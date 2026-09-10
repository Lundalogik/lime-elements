import React from 'react';
import { Option } from '../../select/option.types';
import { isMultiple } from '../../../util/multiple';
import { LimeElementsWidgetAdapter } from '../adapters';
import { WidgetProps } from './types';
import { FormSchema } from '../form.types';

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
        const enumOptions = props.options.enumOptions as EnumOption[];
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

/**
 * One of the choices rjsf hands to the widget, derived from the schema.
 *
 * `schema` is the schema of the corresponding alternative in a `oneOf` or
 * an `anyOf`, and is only present for such schemas. A plain `enum` has no
 * sub schema to read from, so those choices only carry a label and a value.
 */
interface EnumOption {
    label: string;
    value: string;
    schema?: FormSchema;
}

/**
 * Turn a choice from rjsf into an `Option` for `limel-select`.
 *
 * @param item - the choice to convert
 * @returns the option to render in `limel-select`
 */
function createOption(item: EnumOption): Option {
    const schema = item.schema;

    return {
        text: item.label,
        value: item.value,
        secondaryText: schema?.description,
        icon: schema?.lime?.icon,
        disabled: !!schema?.readOnly,
    };
}

function findValue(value: string, options: Option[]) {
    return options.find((option: Option) => option.value === value);
}

function findValues(value: string[], options: Option[]) {
    return options.filter((option: Option) => value.includes(option.value));
}
