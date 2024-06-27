import React from 'react';
import { DatePicker } from './date-picker';
import { WidgetProps } from './types';

export const TimePicker: React.FunctionComponent<WidgetProps> = ({
    value,
    ...props
}) => {
    if (typeof value === 'string' && timeStringPattern.test(value)) {
        value = new Date('2000-01-01T' + value);
    }

    return React.createElement(DatePicker, {
        type: 'time',
        value: value,
        ...props,
    });
};

const timeStringPattern = /^\d\d:\d\d/;
