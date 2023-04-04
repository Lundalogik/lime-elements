import React from 'react';
import { DatePicker } from './date-picker';
import { WidgetProps } from './types';

export const DateOnlyPicker: React.FunctionComponent<WidgetProps> = ({
    value,
    ...props
}) => {
    // A date-only string is treated as UTC by the Date constructor,
    // but we want to parse it as local date
    if (typeof value === 'string' && /-\d\d$/.test(value)) {
        value += 'T00:00';
    }

    return React.createElement(DatePicker, {
        type: 'date',
        value: value,
        ...props,
    });
};
