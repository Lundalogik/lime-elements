import moment from 'moment/moment';
import React from 'react';
import { DateType } from '../../date-picker/date.types';
import { WidgetProps } from './types';
import { getHelperText } from '../schema';

export class DatePicker extends React.Component {
    public refs: any;
    public state = {
        modified: false
    };

    constructor(public props: WidgetProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    public componentDidMount() {
        const element: HTMLLimelDatePickerElement = this.refs.ref;

        element.addEventListener('change', this.handleChange);
        element.addEventListener('blur', this.handleBlur);
        this.setValue(element);
    }

    public componentWillUnmount() {
        const element: HTMLLimelDatePickerElement = this.refs.ref;

        element.removeEventListener('change', this.handleChange);
        element.removeEventListener('blur', this.handleBlur);
    }

    public componentDidUpdate(prevProps: any) {
        const element: HTMLLimelDatePickerElement = this.refs.ref;

        if (this.props.value !== prevProps.value) {
            this.setValue(element);
        }
    }

    public render() {
        const props: WidgetProps = this.props;
        const type = getDateType(props.schema);

        return React.createElement('limel-date-picker', {
            disabled: props.disabled,
            label: props.label,
            required: props.required,
            invalid: this.isInvalid(),
            'helper-text': getHelperText(props.schema, !this.isInvalid(), props.rawErrors),
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

    private handleChange(event: CustomEvent<Date>) {
        const props = this.props;
        event.stopPropagation();

        if (!props.onChange) {
            return;
        }

        const dateString = moment(event.detail).format('YYYY-MM-DD');
        props.onChange(dateString);
    }

    private handleBlur() {
        this.setState({
            modified: true
        });
    }

    private isInvalid() {
        if (!this.state.modified) {
            return false;
        }

        return !!this.props.rawErrors;
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
