import flatpickr from 'flatpickr';
import { EventEmitter } from '@stencil/core';
import { Picker } from './Picker';

export class DatetimePicker extends Picker {
    public constructor(
        dateFormat: string = 'L - LT',
        language: string,
        change: EventEmitter
    ) {
        super(dateFormat, language, change);
    }

    public getConfig(nativePicker: boolean): flatpickr.Options.Options {
        return {
            enableTime: true,
            weekNumbers: !nativePicker,
            time_24hr: true,
            minuteIncrement: 5,
        };
    }
}
