import flatpickr from 'flatpickr';
import { EventEmitter } from '@stencil/core';
import { Picker } from './Picker';

export class TimePicker extends Picker {
    public constructor(
        language: string,
        change: EventEmitter,
        dateFormat: string = 'LT',
    ) {
        super(language, change, dateFormat);
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
