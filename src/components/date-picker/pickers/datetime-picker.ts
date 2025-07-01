import flatpickr from 'flatpickr';
import { EventEmitter } from '@stencil/core';
import { Picker } from './picker';

export class DatetimePicker extends Picker {
    public constructor(
        language: string,
        change: EventEmitter,
        dateFormat: string = 'L - LT'
    ) {
        super(language, change, dateFormat);
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
