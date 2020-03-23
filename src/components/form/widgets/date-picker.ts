import moment from 'moment/moment';
import React from 'react';
import { DateType } from '../../date-picker/date.types';
import { WidgetProps } from './types';
import { LimeElementsWidgetAdapter } from '../adapter';

export class DatePicker extends React.Component {
    public refs: any;
    public state = {
        modified: false,
    };

    constructor(public props: WidgetProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        const props: WidgetProps = this.props;
        const type = getDateType(props.schema);

        return React.createElement(LimeElementsWidgetAdapter, {
            name: 'limel-date-picker',
            value: this.getValue(),
            events: {
                change: this.handleChange,
            },
            widgetProps: props,
            extraProps: {
                type: type,
            },
        });
    }

    private getValue() {
        if (typeof this.props.value === 'string') {
            return new Date(this.props.value);
        } else {
            return this.props.value;
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
