import flatpickr from 'flatpickr';
import { EventEmitter } from '@stencil/core';
import { Picker } from './Picker';

export class TimePicker extends Picker {
    public constructor(
        dateFormat: string = 'LT',
        language: string,
        change: EventEmitter,
    ) {
        super(dateFormat, language, change);
    }

    public getConfig(): flatpickr.Options.Options {
        return {
            enableTime: true,
            noCalendar: true,
            time_24hr: true, // eslint-disable-line camelcase
            minuteIncrement: 5,
            defaultHour: 12,
            defaultMinute: 0,
        };
    }
}
