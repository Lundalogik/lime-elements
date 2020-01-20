import React from 'react';
import { Option } from 'src/components/select/option.types';
import { isMultiple } from '../../../util/multiple';

export class Select extends React.Component {
    private refs: any;
    private props: any;

    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
    }

    public componentDidMount() {
        const element: HTMLLimelSelectElement = this.refs.ref;

        this.setOptions(element);
        this.setValue(element);
        element.addEventListener('change', this.handleChange);
    }

    public componentWillUnmount() {
        const element: HTMLLimelSelectElement = this.refs.ref;

        element.removeEventListener('change', this.handleChange);
    }

    public componentDidUpdate(prevProps: any) {
        const props = this.props;
        const element: HTMLLimelSelectElement = this.refs.ref;

        if (props.options !== prevProps.options) {
            this.setOptions(element);
        }

        if (props.value !== prevProps.value) {
            this.setValue(element);
        }
    }

    public render() {
        const props: any = this.props;

        return React.createElement('limel-select', {
            label: props.label || props.schema.title,
            disabled: props.disabled,
            required: props.required,
            multiple: props.multiple,
            'helper-text': props.schema.description,
            ref: 'ref',
        });
    }

    private setOptions(element: HTMLLimelSelectElement) {
        const props = this.props;

        const options = props.options.enumOptions.map(createOption);
        element.options = options;
    }

    private setValue(element: HTMLLimelSelectElement) {
        const props = this.props;
        const options = element.options;

        if (props.multiple) {
            element.value = findValues(props.value, options);
        } else {
            element.value = findValue(props.value, options);
        }
    }

    private handleChange(event: CustomEvent<Option | Option[]>) {
        const props = this.props;
        event.stopPropagation();

        if (!props.onChange) {
            return;
        }

        if (isMultiple(event.detail)) {
            const value = event.detail.map(option => option.value);
            props.onChange(value);

            return;
        }

        props.onChange(event.detail.value);
    }
}

function createOption(item: { label: string; value: string }): Option {
    return {
        text: item.label,
        value: item.value,
    };
}

function findValue(value: string, options: Option[]) {
    return options.find((option: Option) => option.value === value);
}

function findValues(value: string[], options: Option[]) {
    return options.filter((option: Option) => value.includes(option.value));
}
