import moment from 'moment/moment';
import React from 'react';
import { DateType } from '../../date-picker/date.types';
import { WidgetProps } from './types';
import { LimeElementsWidgetAdapter } from '../adapters';

type DateWidgetProps = WidgetProps & {
    type?: DateType;
};

export class DatePicker extends React.Component<DateWidgetProps> {
    public refs: any;
    public state = {
        modified: false,
    };

    constructor(public props: DateWidgetProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        const { type = 'datetime', ...props } = this.props;

        return React.createElement(LimeElementsWidgetAdapter, {
            name: 'limel-date-picker',
            value: this.getValue(),
            events: {
                change: this.handleChange,
            },
            widgetProps: props,
            extraProps: {
                type: type,
                ...props.schema.lime?.component?.props,
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

        if (!event.detail) {
            props.onChange(null);

            return;
        }

        const formatMapping = {
            'date-time': 'YYYY-MM-DDTHH:mm:ssZ',
            date: 'YYYY-MM-DD',
            time: 'HH:mm:ss',
        };
        const dateString = moment(event.detail).format(
            formatMapping[props.schema.format]
        );
        props.onChange(dateString);
    }
}
