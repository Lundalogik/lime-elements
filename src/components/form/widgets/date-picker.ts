import moment from 'moment/moment';
import React from 'react';
import { WidgetProps } from './types';
import { LimeElementsWidgetAdapter } from '../adapters';

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
        const additionalProps = getAdditionalProps(props.schema);

        return React.createElement(LimeElementsWidgetAdapter, {
            name: 'limel-date-picker',
            value: this.getValue(),
            events: {
                change: this.handleChange,
            },
            widgetProps: props,
            extraProps: {
                ...additionalProps,
            },
        });
    }

    private getValue(): Date {
        if (typeof this.props.value !== 'string') {
            return this.props.value;
        }

        if (!moment(this.props.value).isValid()) {
            const dateString = this.getDateFromString(this.props.value);
            if (dateString) {
                return new Date(dateString);
            }
        }

        return new Date(this.props.value);
    }

    private getDateFromString(value: string): string | null {
        const dateRegexp = /([0-9][0-9][0-9][0-9])[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])[T]([01][1-9]|[2][0-3])[:]([0-5][0-9])[:]([0-5][0-9])([+|-]([01][0-9]|[2][0-3])[:]([0-5][0-9])){0,1}/;
        const dateString = value.match(dateRegexp);

        if (Array.isArray(dateString) && !!dateString[0]) {
            return dateString[0];
        }

        return null;
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

function getAdditionalProps(schema: any) {
    let props: any = {};

    if (schema.lime?.component?.props) {
        props = schema.lime.component.props;
    }

    return props;
}
