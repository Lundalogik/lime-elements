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

        const formatMapping = {
            'date-time': 'YYYY-MM-DDTHH:mm:ss',
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
