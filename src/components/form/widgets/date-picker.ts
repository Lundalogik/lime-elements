import React from 'react';
import { DateType } from '../../date-picker/date.types';

export class DatePicker extends React.Component {
    private refs: any;
    private props: any;

    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
    }

    public componentDidMount() {
        const element: HTMLLimelDatePickerElement = this.refs.ref;

        element.addEventListener('change', this.handleChange);
        this.setValue(element);
    }

    public componentWillUnmount() {
        const element: HTMLLimelDatePickerElement = this.refs.ref;

        element.removeEventListener('change', this.handleChange);
    }

    public componentDidUpdate(prevProps: any) {
        const element: HTMLLimelDatePickerElement = this.refs.ref;

        if (this.props.value !== prevProps.value) {
            this.setValue(element);
        }
    }

    public render() {
        const props = this.props;
        const type = getDateType(props.schema);

        return React.createElement('limel-date-picker', {
            disabled: props.disabled,
            label: props.label,
            required: props.required,
            'helper-text': props.schema.description,
            type: type,
            ref: 'ref',
        });
    }

    private setValue(element: HTMLLimelDatePickerElement) {
        if (typeof this.props.value === 'string') {
            element.value = new Date(this.props.value);
        } else {
            element.value = this.props.value;
        }
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

function getDateType(schema: any): DateType {
    const format = schema.format;
    const mapping = {
        'date-time': 'datetime',
        date: 'date',
        time: 'time',
    };

    return mapping[format] || 'datetime';
}
